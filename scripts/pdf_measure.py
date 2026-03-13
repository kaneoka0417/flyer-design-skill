#!/usr/bin/env python3
"""
PDF座標抽出・セクション高さ比較スクリプト

使い方:
  python pdf_measure.py <original.pdf> <generated.pdf>
  python pdf_measure.py <single.pdf>  # 単体の座標ダンプ

PDFの全テキスト要素の座標を抽出し、セクション境界キーワードで
各ゾーンの高さを算出。2つのPDFを指定した場合は差分テーブルを出力。
"""
import sys
import pdfplumber

# 1pt = 0.3528mm
PT_TO_MM = 0.3528

# セクション境界を特定するキーワード（出現順）
SECTION_MARKERS = [
    ("top-band", "地域を救う"),
    ("zone-partnership", "CORPORATE"),
    ("7-elements", "循環を支える"),
    ("ranks", "4つの認定"),
    ("zone-participation", "PARTICIPATION"),
    ("zone-cotton", "COTTON"),
    ("cta", "まずはお気軽"),
    ("footer", "Blue Earth"),
    ("bottom", None),  # ページ末尾
]


def extract_words_sorted(pdf_path):
    """PDFからテキスト要素を抽出し、Y座標順にソート"""
    pdf = pdfplumber.open(pdf_path)
    page = pdf.pages[0]
    page_height = page.height  # pt単位
    words = page.extract_words(keep_blank_chars=True, x_tolerance=3, y_tolerance=3)
    # Y座標順にソート
    words.sort(key=lambda w: (w["top"], w["x0"]))
    pdf.close()
    return words, page_height


def find_section_boundaries(words, page_height):
    """キーワードでセクション境界のY座標(mm)を特定"""
    boundaries = {}

    for name, keyword in SECTION_MARKERS:
        if keyword is None:
            # ページ末尾
            boundaries[name] = page_height * PT_TO_MM
            continue
        for w in words:
            if keyword in w["text"]:
                boundaries[name] = w["top"] * PT_TO_MM
                break

    return boundaries


def compute_section_heights(boundaries):
    """セクション境界からセクション高さを算出"""
    names = [name for name, _ in SECTION_MARKERS]
    heights = {}

    for i in range(len(names) - 1):
        if names[i] in boundaries and names[i + 1] in boundaries:
            heights[names[i]] = boundaries[names[i + 1]] - boundaries[names[i]]

    return heights


def dump_words(words, page_height):
    """全テキスト要素の座標をダンプ"""
    print(f"Page height: {page_height:.1f}pt = {page_height * PT_TO_MM:.1f}mm")
    print(f"{'Y(mm)':>8} {'X(mm)':>8} {'W(mm)':>8} {'H(mm)':>8}  Text")
    print("-" * 70)
    for w in words:
        y_mm = w["top"] * PT_TO_MM
        x_mm = w["x0"] * PT_TO_MM
        w_mm = (w["x1"] - w["x0"]) * PT_TO_MM
        h_mm = (w["bottom"] - w["top"]) * PT_TO_MM
        text = w["text"][:50]
        print(f"{y_mm:8.1f} {x_mm:8.1f} {w_mm:8.1f} {h_mm:8.1f}  {text}")


def print_comparison(boundaries1, heights1, boundaries2, heights2):
    """2つのPDFのセクション高さ差分テーブルを出力"""
    names = [name for name, _ in SECTION_MARKERS if name != "bottom"]

    print()
    print("=" * 80)
    print("セクション高さ比較テーブル")
    print("=" * 80)
    print(f"{'セクション':<22} {'原本Y(mm)':>10} {'生成Y(mm)':>10} {'Yズレ(mm)':>10} │ {'原本H(mm)':>10} {'生成H(mm)':>10} {'H差分(mm)':>10}")
    print("-" * 95)

    for name in names:
        y1 = boundaries1.get(name, 0)
        y2 = boundaries2.get(name, 0)
        h1 = heights1.get(name, 0)
        h2 = heights2.get(name, 0)
        y_diff = y2 - y1
        h_diff = h2 - h1

        # 差分が大きい場合は目立たせる
        y_flag = " <<<" if abs(y_diff) > 1.0 else ""
        h_flag = " <<<" if abs(h_diff) > 1.0 else ""

        print(f"{name:<22} {y1:10.1f} {y2:10.1f} {y_diff:+10.1f}{y_flag} │ {h1:10.1f} {h2:10.1f} {h_diff:+10.1f}{h_flag}")

    print("-" * 95)
    print()
    print(">>> はY座標の累積ズレ、<<< は1mm以上の差分を示す")
    print("Yズレ(mm): 正=生成版が下にずれている、負=生成版が上にずれている")
    print("H差分(mm): 正=生成版のセクションが高い、負=生成版のセクションが低い")


def main():
    if len(sys.argv) < 2:
        print("Usage: python pdf_measure.py <original.pdf> [generated.pdf]")
        sys.exit(1)

    pdf1 = sys.argv[1]
    words1, height1 = extract_words_sorted(pdf1)
    boundaries1 = find_section_boundaries(words1, height1)
    heights1 = compute_section_heights(boundaries1)

    print(f"\n--- {pdf1} ---")
    dump_words(words1, height1)

    print("\nセクション境界:")
    for name, y in sorted(boundaries1.items(), key=lambda x: x[1]):
        print(f"  {name:<22} Y={y:7.1f}mm")

    print("\nセクション高さ:")
    for name, h in heights1.items():
        print(f"  {name:<22} H={h:7.1f}mm")

    if len(sys.argv) >= 3:
        pdf2 = sys.argv[2]
        words2, height2 = extract_words_sorted(pdf2)
        boundaries2 = find_section_boundaries(words2, height2)
        heights2 = compute_section_heights(boundaries2)

        print(f"\n--- {pdf2} ---")
        dump_words(words2, height2)

        print("\nセクション境界:")
        for name, y in sorted(boundaries2.items(), key=lambda x: x[1]):
            print(f"  {name:<22} Y={y:7.1f}mm")

        print("\nセクション高さ:")
        for name, h in heights2.items():
            print(f"  {name:<22} H={h:7.1f}mm")

        print_comparison(boundaries1, heights1, boundaries2, heights2)


if __name__ == "__main__":
    main()
