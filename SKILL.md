---
name: flyer-design
description: 日本語チラシのデザイン・作成・PDF出力スキル。チラシ、フライヤー、ビラ、販促物の作成時に使用。レイアウト、配色、タイポグラフィ、視線誘導、印刷設定（350dpi/CMYK/塗り足し）のノウハウを提供。HTML/CSS→PDFワークフロー対応。
---

# 日本語チラシデザインスキル

チラシをデザインし、印刷用PDFを生成するためのガイド。

## クイックスタート

1. 要件確認（目的、ターゲット、掲載情報、サイズ）
2. 情報整理と優先順位付け
3. HTML/CSSでデザイン作成
4. PDF生成（`scripts/html_to_pdf.js`）

## ワークフロー

### Step 1: 要件ヒアリング

必須項目：
- **目的**: 何を伝えたいか（イベント告知、セール、新商品等）
- **ターゲット**: 誰に届けるか（年齢層、性別、地域等）
- **サイズ**: A4/A5/B5など（デフォルト: A4縦）
- **掲載情報**: タイトル、日時、場所、価格、連絡先、QRコード等

### Step 2: デザイン原則（参照: references/design-principles.md）

**レイアウト基本**
- グリッド: 3分割または4分割
- 余白: 版面率60-70%、四方最低10mm
- 視線誘導: 横書き→Z型/F型、縦書き→N型

**配色（3色の法則）**
- ベースカラー 70%（背景：白/ベージュ/薄グレー）
- メインカラー 25%（テーマ色）
- アクセントカラー 5%（CTA/価格強調）

**タイポグラフィ**
- フォント3種類以内
- タイトル: 20pt以上
- 見出し: 14-18pt
- 本文: 8-12pt（高齢者向け12pt以上）
- 行間: 文字サイズの1.5-2倍

### Step 3: HTML/CSSでデザイン

テンプレートを使用: `assets/templates/basic-a4.html`

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 0; }
    body {
      font-family: "Noto Sans JP", sans-serif;
      width: 210mm;
      height: 297mm;
      padding: 15mm;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <!-- チラシコンテンツ -->
</body>
</html>
```

### Step 4: PDF生成（印刷互換性対応）

```bash
# 推奨: Puppeteer + Ghostscript（印刷互換性最高）
node scripts/html_to_pdf.js flyer.html flyer.pdf

# サイズ指定
node scripts/html_to_pdf.js flyer.html flyer.pdf --size A4-bleed

# Ghostscriptスキップ（デバッグ用）
node scripts/html_to_pdf.js flyer.html flyer.pdf --no-gs
```

**対応サイズ**: A4, A5, B5, A4-bleed, A5-bleed

## 印刷互換性

### 方針：デザインに制約をかけない

グラデーション、透過、影など**自由に使ってOK**。
Ghostscript後処理で印刷互換性を確保する。

### Ghostscript後処理（必須）

`--no-gs` は使わない。以下を自動処理：
- Type3フォント → アウトライン化
- 透過レイヤー → PDF 1.3でフラットニング
- 複雑なShading → 単純化

詳細は `references/print-compatibility.md` 参照

### 必要なツール
```bash
npm install puppeteer        # Chromium自動ダウンロード
sudo apt install ghostscript # PDF後処理（必須！）
```

## 印刷用設定

- **解像度**: 350dpi
- **カラーモード**: CMYK（RGB→CMYK変換は印刷所で対応可）
- **塗り足し**: フチなし印刷時は仕上がりサイズ+3mm
- **フォント**: 埋め込み必須（Ghostscriptでアウトライン化）

## ⚠️ 重要：チラシはWebサイトではない

HTMLで作るからといってLP（ランディングページ）風にしない！

**よくある失敗：**
- 余白を取りすぎる
- 情報を整理しすぎる
- 縦スクロール前提のレイアウト
- シンプルすぎて目を引かない

**チラシの特徴：**
- 情報を詰め込む（高密度）
- 余白は少なめ
- 破裂マーク、集中線など装飾的
- A4固定サイズに収める（**絶対にはみ出し禁止**）
- アイコン・イラストで視覚的に

**A4に収めるCSS必須設定：**
```css
body {
  width: 210mm;
  height: 297mm;
  overflow: hidden; /* 絶対はみ出さない */
}
.container {
  padding: 6-8mm; /* 余白控えめ */
}
```

詳細は `references/flyer-vs-web.md` を参照。
アイコン・画像は `references/icons-images.md` を参照。

## 参照ファイル

- `references/design-principles.md` - デザイン原則詳細
- `references/color-guide.md` - 配色・日本の季節感
- `references/typography.md` - 日本語タイポグラフィ
- `references/flyer-vs-web.md` - チラシとWebの違い（重要）
- `references/icons-images.md` - アイコン・イラスト・画像
- `references/print-compatibility.md` - **印刷互換性（必読）**
- `assets/templates/` - HTMLテンプレート
- `scripts/html_to_pdf.js` - PDF生成スクリプト
