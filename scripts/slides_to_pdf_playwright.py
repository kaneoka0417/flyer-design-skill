#!/usr/bin/env python3
"""Generate PDF from Reveal.js presentation using Playwright."""
import sys
import os
from pathlib import Path

def main():
    if len(sys.argv) < 3:
        print("Usage: python slides_to_pdf_playwright.py <input.html> <output.pdf>")
        sys.exit(1)

    input_html = sys.argv[1]
    output_pdf = sys.argv[2]

    # Convert to absolute path
    input_path = Path(input_html).resolve()
    output_path = Path(output_pdf).resolve()

    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)

    file_url = f"file://{input_path}?print-pdf"
    print(f"Generating PDF from: {file_url}")
    print(f"Output: {output_path}")

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        page = browser.new_page(
            viewport={'width': 1920, 'height': 1080},
            device_scale_factor=2
        )

        page.goto(file_url, wait_until='networkidle', timeout=30000)
        # Wait for Reveal.js to initialize
        page.wait_for_timeout(3000)

        page.pdf(
            path=str(output_path),
            width='1920px',
            height='1080px',
            print_background=True,
            prefer_css_page_size=True,
            scale=1,
            margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'}
        )

        browser.close()

    print(f"PDF generated: {output_path}")
    print(f"File size: {output_path.stat().st_size / 1024:.1f} KB")

if __name__ == '__main__':
    main()
