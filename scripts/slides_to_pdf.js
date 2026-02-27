#!/usr/bin/env node
/**
 * Reveal.js slides to print-ready PDF converter.
 *
 * Features:
 * - Puppeteer for Reveal.js HTML -> PDF (with ?print-pdf mode)
 * - Waits for Reveal.js ready event before capture
 * - 16:9 and 4:3 aspect ratio support
 * - Ghostscript 2-stage post-processing for printer compatibility
 *   - PDF 1.3 conversion (removes transparency)
 *   - Font outlining
 *   - /prepress quality (no image downsampling)
 *
 * Usage:
 *   node slides_to_pdf.js input.html output.pdf
 *   node slides_to_pdf.js input.html output.pdf --size 16:9
 *   node slides_to_pdf.js input.html output.pdf --size 4:3
 *   node slides_to_pdf.js input.html output.pdf --no-gs
 *   node slides_to_pdf.js input.html output.pdf --slides-per-page 2
 */

const puppeteer = require('puppeteer');
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Slide sizes in mm (standard presentation dimensions)
const SLIDE_SIZES = {
  '16:9': { width: 254, height: 142.9 },   // 10" x 5.625" widescreen
  '4:3':  { width: 254, height: 190.5 },    // 10" x 7.5" standard
};

// Viewport dimensions for each aspect ratio
const VIEWPORTS = {
  '16:9': { width: 1920, height: 1080 },
  '4:3':  { width: 1920, height: 1440 },
};

/**
 * Check if Ghostscript is available
 */
function hasGhostscript() {
  try {
    execSync('which gs', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert PDF to printer-compatible format using Ghostscript
 * 2-stage process for maximum compatibility:
 * 1. PDF -> PostScript (flattens structure)
 * 2. PostScript -> PDF (outlines fonts, flattens transparency)
 */
function convertWithGhostscript(inputPdf, outputPdf) {
  const tempPs = path.join(os.tmpdir(), `slides-temp-${Date.now()}.ps`);

  console.log('Stage 1: Converting PDF to PostScript...');

  // Stage 1: PDF -> PostScript
  const stage1Args = [
    'gs',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=ps2write',
    `-sOutputFile=${tempPs}`,
    inputPdf
  ];

  const result1 = spawnSync(stage1Args[0], stage1Args.slice(1), {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result1.status !== 0) {
    const stderr = result1.stderr?.toString() || '';
    throw new Error(`Ghostscript Stage 1 failed: ${stderr}`);
  }

  console.log('Stage 2: Converting PostScript to printer-compatible PDF...');

  // Stage 2: PostScript -> PDF (with font outlining and flattening)
  const stage2Args = [
    'gs',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.3',      // PDF 1.3 for max compatibility
    '-dPDFSETTINGS=/prepress',       // Prepress quality (highest)
    '-dNoOutputFonts',               // Convert all text to outlines
    // Image resolution settings (600 dpi)
    '-dColorImageResolution=600',
    '-dGrayImageResolution=600',
    '-dMonoImageResolution=1200',
    // Downsample settings - disabled for max quality
    '-dDownsampleColorImages=false',
    '-dDownsampleGrayImages=false',
    '-dDownsampleMonoImages=false',
    // Color settings
    '-dColorConversionStrategy=/LeaveColorUnchanged',
    // Additional settings
    '-dAutoRotatePages=/None',
    `-sOutputFile=${outputPdf}`,
    tempPs
  ];

  const result2 = spawnSync(stage2Args[0], stage2Args.slice(1), {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Clean up temp file
  try { fs.unlinkSync(tempPs); } catch {}

  if (result2.status !== 0) {
    const stderr = result2.stderr?.toString() || '';
    throw new Error(`Ghostscript Stage 2 failed: ${stderr}`);
  }

  console.log('Ghostscript 2-stage conversion complete.');
  console.log('- All fonts converted to outlines');
  console.log('- Transparency flattened to PDF 1.3');
}

/**
 * Wait for Reveal.js to be fully initialized
 */
async function waitForReveal(page, timeout = 15000) {
  console.log('Waiting for Reveal.js to initialize...');

  const isReady = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      const deadline = Date.now() + 15000;

      // Check if Reveal is already ready
      if (typeof Reveal !== 'undefined' && typeof Reveal.isReady === 'function' && Reveal.isReady()) {
        resolve(true);
        return;
      }

      // Wait for the ready event
      if (typeof Reveal !== 'undefined' && typeof Reveal.on === 'function') {
        Reveal.on('ready', () => resolve(true));
      }

      // Poll as fallback
      const interval = setInterval(() => {
        if (typeof Reveal !== 'undefined' && typeof Reveal.isReady === 'function' && Reveal.isReady()) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() > deadline) {
          clearInterval(interval);
          reject(new Error('Reveal.js did not initialize within timeout'));
        }
      }, 200);
    });
  }).catch(err => {
    console.warn(`Warning: ${err.message}. Proceeding anyway...`);
    return false;
  });

  if (isReady) {
    console.log('Reveal.js is ready.');
  }

  return isReady;
}

/**
 * Main conversion function
 */
async function convertSlidesToPdf(inputPath, outputPath, options = {}) {
  const {
    size = '16:9',
    useGhostscript = true,
    slidesPerPage = 1,
  } = options;

  const absoluteInput = path.resolve(inputPath);

  if (!fs.existsSync(absoluteInput)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const slideSize = SLIDE_SIZES[size] || SLIDE_SIZES['16:9'];
  const viewport = VIEWPORTS[size] || VIEWPORTS['16:9'];

  // Temp file for intermediate PDF (before Ghostscript)
  const tempPdf = useGhostscript && hasGhostscript()
    ? path.join(os.tmpdir(), `slides-temp-${Date.now()}.pdf`)
    : outputPath;

  console.log(`Generating slide PDF from: ${inputPath}`);
  console.log(`Slide size: ${size} (${slideSize.width}mm x ${slideSize.height}mm)`);
  console.log(`Viewport: ${viewport.width}x${viewport.height}`);
  console.log(`Slides per page: ${slidesPerPage}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport to 16:9 or 4:3 at screen resolution with 2x scale for quality
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 2
    });

    // Build URL with ?print-pdf query parameter for Reveal.js print mode
    const fileUrl = `file://${absoluteInput}?print-pdf`;
    console.log(`Loading: ${fileUrl}`);

    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to fully load
    await page.evaluateHandle('document.fonts.ready');

    // Wait for Reveal.js initialization
    await waitForReveal(page);

    // Additional wait for any async rendering / transitions
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate page dimensions based on slides-per-page
    let pdfWidth = slideSize.width;
    let pdfHeight = slideSize.height;

    if (slidesPerPage > 1) {
      // Stack slides vertically on a single page
      pdfHeight = slideSize.height * slidesPerPage;
    }

    // Generate PDF
    await page.pdf({
      path: tempPdf,
      width: `${pdfWidth}mm`,
      height: `${pdfHeight}mm`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log(`Puppeteer PDF generated: ${tempPdf}`);

  } finally {
    await browser.close();
  }

  // Post-process with Ghostscript if available
  if (useGhostscript && hasGhostscript()) {
    try {
      convertWithGhostscript(tempPdf, outputPath);
      // Clean up temp file
      fs.unlinkSync(tempPdf);
    } catch (err) {
      console.error(`Ghostscript error: ${err.message}`);
      console.log('Falling back to Puppeteer-only PDF...');
      fs.renameSync(tempPdf, outputPath);
    }
  } else if (useGhostscript && !hasGhostscript()) {
    console.error('ERROR: Ghostscript not found!');
    console.error('Ghostscript is REQUIRED for printer-compatible PDF output.');
    console.error('');
    console.error('Install with:');
    console.error('  Ubuntu/Debian: sudo apt install ghostscript');
    console.error('  macOS: brew install ghostscript');
    console.error('  Windows: https://ghostscript.com/releases/gsdnld.html');
    console.error('');
    console.error('Or use --no-gs to skip (NOT recommended for printing)');
    process.exit(1);
  }

  console.log(`\nDone. PDF generated: ${outputPath}`);
}

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node slides_to_pdf.js <input.html> <output.pdf> [options]

Options:
  --size <size>           Aspect ratio: 16:9 (default), 4:3
  --slides-per-page <n>   Slides per PDF page (default: 1)
  --no-gs                 Skip Ghostscript post-processing
  --help, -h              Show this help

Sizes:
  16:9   254mm x 142.9mm  (widescreen, default)
  4:3    254mm x 190.5mm  (standard)

Examples:
  node slides_to_pdf.js presentation.html slides.pdf
  node slides_to_pdf.js presentation.html slides.pdf --size 4:3
  node slides_to_pdf.js presentation.html slides.pdf --slides-per-page 2
  node slides_to_pdf.js presentation.html slides.pdf --no-gs
`);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const inputPath = args[0];
  const outputPath = args[1];
  let size = '16:9';
  let useGhostscript = true;
  let slidesPerPage = 1;

  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--size' && args[i + 1]) {
      size = args[i + 1];
      if (!SLIDE_SIZES[size]) {
        console.error(`Error: Unknown size "${size}". Supported: ${Object.keys(SLIDE_SIZES).join(', ')}`);
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--slides-per-page' && args[i + 1]) {
      slidesPerPage = parseInt(args[i + 1], 10);
      if (isNaN(slidesPerPage) || slidesPerPage < 1) {
        console.error('Error: --slides-per-page must be a positive integer');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--no-gs') {
      useGhostscript = false;
    }
  }

  return { inputPath, outputPath, size, useGhostscript, slidesPerPage };
}

// Main
const { inputPath, outputPath, size, useGhostscript, slidesPerPage } = parseArgs();
convertSlidesToPdf(inputPath, outputPath, { size, useGhostscript, slidesPerPage })
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
