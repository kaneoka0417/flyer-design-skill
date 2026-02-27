#!/usr/bin/env node
/**
 * HTML to print-ready PDF converter.
 * 
 * Features:
 * - Puppeteer for HTML→PDF (with font loading wait)
 * - Ghostscript post-processing for printer compatibility
 *   - PDF 1.3 conversion (removes transparency)
 *   - Font outlining
 *   - /prepress quality (no image downsampling)
 *
 * Usage:
 *   node html_to_pdf.js input.html output.pdf
 *   node html_to_pdf.js input.html output.pdf --size A4
 *   node html_to_pdf.js input.html output.pdf --no-gs  # Skip Ghostscript
 */

const puppeteer = require('puppeteer');
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Page sizes in mm
const PAGE_SIZES = {
  'A4': { width: 210, height: 297 },
  'A5': { width: 148, height: 210 },
  'B5': { width: 182, height: 257 },
  'A4-landscape': { width: 297, height: 210 },
  // 塗り足し込み (bleed +3mm each side)
  'A4-bleed': { width: 216, height: 303 },
  'A5-bleed': { width: 154, height: 216 },
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
  const tempPs = path.join(os.tmpdir(), `flyer-temp-${Date.now()}.ps`);
  
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
    '-dPDFSETTINGS=/prepress',        // Prepress quality (highest)
    '-dNoOutputFonts',               // ★ KEY: Convert all text to outlines
    // Image resolution settings
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
 * Main conversion function
 */
async function convertHtmlToPdf(inputPath, outputPath, options = {}) {
  const { size = 'A4', useGhostscript = true } = options;
  
  const absoluteInput = path.resolve(inputPath);
  
  if (!fs.existsSync(absoluteInput)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  const pageSize = PAGE_SIZES[size] || PAGE_SIZES['A4'];
  
  // Temp file for intermediate PDF (before Ghostscript)
  const tempPdf = useGhostscript && hasGhostscript()
    ? path.join(os.tmpdir(), `flyer-temp-${Date.now()}.pdf`)
    : outputPath;
  
  console.log(`Generating PDF from: ${inputPath}`);
  console.log(`Page size: ${size} (${pageSize.width}mm x ${pageSize.height}mm)`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to match page size (at 96 DPI for rendering)
    await page.setViewport({
      width: Math.round(pageSize.width * 96 / 25.4),
      height: Math.round(pageSize.height * 96 / 25.4),
      deviceScaleFactor: 2
    });
    
    // Load HTML file
    await page.goto(`file://${absoluteInput}`, {
      waitUntil: 'networkidle0',  // Wait until no network activity
      timeout: 30000
    });
    
    // Wait for fonts to fully load
    await page.evaluateHandle('document.fonts.ready');
    
    // Additional wait for any async rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate PDF
    await page.pdf({
      path: tempPdf,
      width: `${pageSize.width}mm`,
      height: `${pageSize.height}mm`,
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
  
  console.log(`\n✅ PDF generated: ${outputPath}`);
}

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node html_to_pdf.js <input.html> <output.pdf> [options]

Options:
  --size <size>   Page size: A4, A5, B5, A4-bleed, A5-bleed (default: A4)
  --no-gs         Skip Ghostscript post-processing
  --help, -h      Show this help

Examples:
  node html_to_pdf.js flyer.html flyer.pdf
  node html_to_pdf.js flyer.html flyer.pdf --size A4-bleed
  node html_to_pdf.js flyer.html flyer.pdf --no-gs
`);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }
  
  const inputPath = args[0];
  const outputPath = args[1];
  let size = 'A4';
  let useGhostscript = true;
  
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--size' && args[i + 1]) {
      size = args[i + 1];
      i++;
    } else if (args[i] === '--no-gs') {
      useGhostscript = false;
    }
  }
  
  return { inputPath, outputPath, size, useGhostscript };
}

// Main
const { inputPath, outputPath, size, useGhostscript } = parseArgs();
convertHtmlToPdf(inputPath, outputPath, { size, useGhostscript })
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
