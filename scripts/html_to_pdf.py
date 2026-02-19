#!/usr/bin/env python3
"""
HTML to PDF converter for flyer design.
Uses WeasyPrint for high-quality PDF output.

Usage:
    python html_to_pdf.py input.html output.pdf
    python html_to_pdf.py input.html output.pdf --size A4
"""

import argparse
import sys
from pathlib import Path

def check_weasyprint():
    """Check if WeasyPrint is installed."""
    try:
        import weasyprint
        return True
    except ImportError:
        return False

def convert_html_to_pdf(input_path: str, output_path: str, size: str = "A4"):
    """Convert HTML file to PDF using WeasyPrint."""
    from weasyprint import HTML, CSS
    
    input_file = Path(input_path)
    if not input_file.exists():
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)
    
    # Define page size CSS
    size_css = f"""
    @page {{
        size: {size};
        margin: 0;
    }}
    """
    
    try:
        html = HTML(filename=str(input_file))
        css = CSS(string=size_css)
        html.write_pdf(output_path, stylesheets=[css])
        print(f"PDF generated: {output_path}")
    except Exception as e:
        print(f"Error generating PDF: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Convert HTML to PDF for flyer design")
    parser.add_argument("input", help="Input HTML file")
    parser.add_argument("output", help="Output PDF file")
    parser.add_argument("--size", default="A4", help="Page size (A4, A5, B5, etc.)")
    
    args = parser.parse_args()
    
    if not check_weasyprint():
        print("Error: WeasyPrint is not installed.", file=sys.stderr)
        print("Install with: pip install weasyprint", file=sys.stderr)
        sys.exit(1)
    
    convert_html_to_pdf(args.input, args.output, args.size)

if __name__ == "__main__":
    main()
