# 印刷互換性ガイド

## 方針：デザインに制約をかけない

**グラデーション、透過、影など自由に使ってOK。**
PDF生成時の後処理で印刷互換性を確保する。

---

## Chrome/Puppeteer PDFの技術的問題

### 1. Type3フォント問題
PuppeteerはGoogle FontsをType3フォントに変換する。
→ **Ghostscriptでアウトライン化して解決**

### 2. 透過レイヤー（PDF 1.4+）
CSSの `rgba()`, `opacity`, `backdrop-filter` がPDF透過になる。
→ **GhostscriptでPDF 1.3変換（フラットニング）して解決**

### 3. シェーディング/パターン
CSSグラデーションがPDFのShading/Patternに変換される。
→ **Ghostscriptで単純化して解決**

---

## 解決策：Ghostscript後処理（必須）

`--no-gs` は使わない。Ghostscriptが全て解決する：

| 問題 | Ghostscriptの処理 |
|------|-------------------|
| Type3フォント | アウトライン化 |
| 透過レイヤー | PDF 1.3でフラットニング |
| 複雑なShading | 単純化・ラスタライズ |

---

## Ghostscript設定

### 現在のオプション（html_to_pdf.js）
```bash
gs \
  -dCompatibilityLevel=1.3 \    # PDF 1.3（透過フラットニング）
  -dPDFSETTINGS=/prepress \     # 高品質
  -dEmbedAllFonts=true \        # フォント埋め込み
  -dDownsampleColorImages=false \ # 画像劣化なし
  -sDEVICE=pdfwrite
```

### 処理内容
| 処理 | 効果 |
|------|------|
| PDF 1.3変換 | 透過を完全フラットニング |
| フォント処理 | Type3 → アウトライン化 |
| Shading処理 | 必要に応じてラスタライズ |
| 画像保持 | 品質劣化なし |

---

## チェックリスト

### PDF生成時
- [ ] `--no-gs` を使わない（Ghostscript必須）
- [ ] 出力後にPDFビューアで確認
- [ ] 可能なら実機テスト印刷

### トラブルシューティング
| 症状 | 対処 |
|------|------|
| 印刷エラー | Ghostscript通したか確認 |
| 画像が消える | 画像パス・形式を確認 |
| 色がおかしい | RGBのまま入稿OK（印刷所でCMYK変換） |
| フォントが化ける | Ghostscriptでアウトライン化されてるか確認 |

---

## デザインの自由度

**以下は全て使用OK：**
- `rgba()` 半透明
- `opacity`
- `linear-gradient()` / `radial-gradient()`
- `box-shadow` / `text-shadow`
- `backdrop-filter`（ただし効果が完全再現されない場合あり）

Ghostscriptが適切にフラットニングするので、デザインは自由に。
