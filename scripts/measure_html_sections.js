#!/usr/bin/env node
/**
 * HTML各セクションのbounding boxを計測するスクリプト
 * Puppeteerで実際のレンダリング結果から要素の座標を取得
 *
 * Usage: node measure_html_sections.js <html_file>
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PT_TO_MM = 0.3528;

async function measureSections(htmlPath) {
  const absolutePath = path.resolve(htmlPath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // A4サイズに合わせたviewport (96dpi: 210mm = 793.7px, 297mm = 1122.5px)
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  const fileUrl = `file://${absolutePath}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // 各セクションのbounding boxを取得
  const measurements = await page.evaluate(() => {
    const selectors = {
      'page': '.page',
      'top-band': '.top-band',
      'content': '.content',
      'zone-partnership': '.zone-partnership',
      'section-label-1': '.zone-partnership .section-label',
      'section-heading': '.zone-partnership .section-heading',
      'partnership-desc': '.partnership-desc',
      'elements-row': '.elements-row',
      'elements-grid': '.elements-grid',
      'ranks-heading': '.ranks-heading',
      'ranks-grid': '.ranks-grid',
      'zone-participation': '.zone-participation',
      'participation-heading': '.participation-heading',
      'participation-grid': '.participation-grid',
      'zone-cotton': '.zone-cotton',
      'cotton-heading': '.cotton-heading',
      'cotton-flow': '.cotton-flow',
      'zone-cta': '.zone-cta',
      'zone-footer': '.zone-footer',
      'bottom-bar': '.bottom-bar',
    };

    const results = {};
    for (const [name, selector] of Object.entries(selectors)) {
      const el = document.querySelector(selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        results[name] = {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      } else {
        results[name] = null;
      }
    }

    // ページの全体サイズ
    const pageEl = document.querySelector('.page');
    if (pageEl) {
      results['_page_scroll'] = {
        scrollHeight: pageEl.scrollHeight,
        clientHeight: pageEl.clientHeight,
        offsetHeight: pageEl.offsetHeight,
      };
    }

    return results;
  });

  await browser.close();

  // px → mm 変換 (96dpi: 1mm = 3.7795px)
  const PX_TO_MM = 1 / 3.7795;

  console.log('\n' + '='.repeat(70));
  console.log(`HTML Section Measurements: ${htmlPath}`);
  console.log('='.repeat(70));
  console.log(`${'Section'.padEnd(25)} ${'Top(mm)'.padStart(10)} ${'Bottom(mm)'.padStart(10)} ${'Height(mm)'.padStart(10)}`);
  console.log('-'.repeat(55));

  const sectionOrder = [
    'page', 'top-band', 'content', 'zone-partnership',
    'section-label-1', 'section-heading', 'partnership-desc',
    'elements-row', 'elements-grid', 'ranks-heading', 'ranks-grid',
    'zone-participation', 'participation-heading', 'participation-grid',
    'zone-cotton', 'cotton-heading', 'cotton-flow',
    'zone-cta', 'zone-footer', 'bottom-bar'
  ];

  const mmData = {};
  for (const name of sectionOrder) {
    const m = measurements[name];
    if (m) {
      const top_mm = m.top * PX_TO_MM;
      const bottom_mm = m.bottom * PX_TO_MM;
      const height_mm = m.height * PX_TO_MM;
      mmData[name] = { top: top_mm, bottom: bottom_mm, height: height_mm };
      console.log(`${name.padEnd(25)} ${top_mm.toFixed(1).padStart(10)} ${bottom_mm.toFixed(1).padStart(10)} ${height_mm.toFixed(1).padStart(10)}`);
    }
  }

  console.log('-'.repeat(55));

  // overflow check
  if (measurements['_page_scroll']) {
    const s = measurements['_page_scroll'];
    const overflow_mm = (s.scrollHeight - s.clientHeight) * PX_TO_MM;
    console.log(`\nPage scrollHeight: ${(s.scrollHeight * PX_TO_MM).toFixed(1)}mm`);
    console.log(`Page clientHeight: ${(s.clientHeight * PX_TO_MM).toFixed(1)}mm`);
    console.log(`Overflow: ${overflow_mm.toFixed(1)}mm ${overflow_mm > 0.5 ? '<<< CONTENT OVERFLOWS' : '(OK)'}`);
  }

  // JSON出力（他スクリプトとの連携用）
  const jsonPath = htmlPath.replace(/\.html$/, '_measurements.json');
  fs.writeFileSync(jsonPath, JSON.stringify(mmData, null, 2));
  console.log(`\nJSON saved: ${jsonPath}`);

  return mmData;
}

// 2つのHTMLを比較する場合
async function compareMeasurements(html1, html2) {
  console.log('\n>>> Measuring HTML 1...');
  const m1 = await measureSections(html1);

  console.log('\n>>> Measuring HTML 2...');
  const m2 = await measureSections(html2);

  console.log('\n' + '='.repeat(80));
  console.log('COMPARISON TABLE');
  console.log('='.repeat(80));
  console.log(`${'Section'.padEnd(25)} ${'H1 Top(mm)'.padStart(10)} ${'H2 Top(mm)'.padStart(10)} ${'Y Diff'.padStart(10)} │ ${'H1 H(mm)'.padStart(10)} ${'H2 H(mm)'.padStart(10)} ${'H Diff'.padStart(10)}`);
  console.log('-'.repeat(90));

  for (const name of Object.keys(m1)) {
    if (m2[name]) {
      const yDiff = m2[name].top - m1[name].top;
      const hDiff = m2[name].height - m1[name].height;
      const yFlag = Math.abs(yDiff) > 1.0 ? ' <<<' : '';
      const hFlag = Math.abs(hDiff) > 1.0 ? ' <<<' : '';
      console.log(
        `${name.padEnd(25)} ${m1[name].top.toFixed(1).padStart(10)} ${m2[name].top.toFixed(1).padStart(10)} ${(yDiff >= 0 ? '+' : '') + yDiff.toFixed(1).padStart(9)}${yFlag} │ ${m1[name].height.toFixed(1).padStart(10)} ${m2[name].height.toFixed(1).padStart(10)} ${(hDiff >= 0 ? '+' : '') + hDiff.toFixed(1).padStart(9)}${hFlag}`
      );
    }
  }
  console.log('-'.repeat(90));
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node measure_html_sections.js <html_file> [html_file_2]');
  process.exit(1);
}

if (args.length === 1) {
  measureSections(args[0]);
} else {
  compareMeasurements(args[0], args[1]);
}
