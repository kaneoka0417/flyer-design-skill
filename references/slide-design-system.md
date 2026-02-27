# スライドデザインシステム

Reveal.js でプレゼンテーションスライドを作る際の、スライド専用デザインガイドライン。
チラシのデザイン語彙（高密度、小フォント、色面ブロッキング等）を持ち込まないための指針。

---

## 絶対ルール（非交渉）

1. **1スライド1メッセージ** -- 複数のアイデアを1枚に詰め込まない
2. **絵文字禁止** -- テンプレート・成果物に絵文字を一切使わない。全てインラインSVGアイコンで置換する
3. **テキスト最小限** -- タイトル+キーメッセージ+ビジュアルの3要素以内
4. **フォントサイズ下限** -- タイトル40pt以上、本文18pt以上、キャプション14pt以上
5. **余白は武器** -- スライド面積の20%以上は空白にする
6. **高画質出力** -- PDF生成は必ず高画質設定（deviceScaleFactor:2, /prepress, 600dpi）

---

## 大原則: スライドは「視覚補助」である

スライドは読ませる資料ではない。口頭プレゼンテーションの視覚補助として機能する。
聴衆がスライドを読んでいる間、プレゼンターの声は聞こえていない。

- チラシ: 単体で全情報を伝える（テキスト多め、高密度）
- スライド: プレゼンターの言葉を視覚的に補強する（テキスト最小限、低密度）

### チラシ vs スライドの根本的違い

| 項目 | チラシ | スライド |
| --- | --- | --- |
| 情報密度 | 高い（詰め込む） | 低い（絞り込む） |
| テキスト量 | 多い（単体で情報伝達） | 最小限（口頭補助） |
| 余白 | 最小限（紙面を有効活用） | たっぷり（情報の呼吸） |
| フォントサイズ | 7-28pt | 18-60pt |
| 画像の役割 | 補助的（テキストが主役） | 主役（ビジュアルで伝える） |
| アスペクト比 | A4縦（210x297mm） | 16:9横（1920x1080px） |
| 閲覧距離 | 手元30cm | 投影5-10m |
| 目的 | 単体で情報伝達 | 口頭プレゼンの視覚補助 |
| カラー設計 | 色面ブロッキング（3-4色面） | 3色ルール（背景70%/メイン25%/アクセント5%） |
| レイアウト | ゾーン分割・密度重視 | 中央揃え・余白重視 |
| 1画面の文字数 | 200-400文字 | 最大50文字程度 |

### チラシデザインをスライドに持ち込んだ時のNG例

| チラシでは正解 | スライドではNG | スライドでの正解 |
| --- | --- | --- |
| A4に情報を詰め込む | 1枚に複数トピック | 1スライド1メッセージ |
| 本文8-10pt | テキストが小さすぎ | 本文18pt以上 |
| 余白を最小限に | 余白がなく圧迫感 | 面積20%以上を空白に |
| 色面ブロッキング | 複雑な背景分割 | シンプルな背景+アクセント |
| 区切り線で統一 | 不要な装飾線 | 余白で区切る |
| 箇条書き10項目 | 情報過多 | 箇条書き最大5項目 |

---

## 1. 基本原則

### 1スライド1メッセージの原則

各スライドは1つの明確なメッセージだけを伝える。

**なぜ重要か:**

- 聴衆の注意力は限られている。複数のメッセージがあると、どれも記憶に残らない
- プレゼンターが1つのポイントに集中できる
- スライドの切り替えがリズムを生み、聴衆の注意を引き戻す

**実践方法:**

- スライドを見て「このスライドのメッセージは?」と聞かれたとき、1文で答えられること
- 「AとBの関係」のように2つの概念がある場合も、伝えたいメッセージは1つに絞る
- 情報が多い場合はスライドを分割する（枚数を増やすことは悪ではない）

### 3秒ルール

スライドが表示されてから3秒以内に、メッセージが伝わること。

- タイトルを読めばメッセージが分かる
- ビジュアルを見ればメッセージが分かる
- 3秒で伝わらないスライドは、情報が多すぎるか、構成が悪い

---

## 2. タイポグラフィ

### フォントサイズ階層

| 要素 | プロジェクター投影 | PDF配布 |
| --- | --- | --- |
| メインタイトル | 60pt以上 | 40pt以上 |
| セクションタイトル | 40-48pt | 32-40pt |
| 本文/箇条書き | 24-32pt | 18-24pt |
| キャプション/注釈 | 18-20pt | 14-16pt |

**絶対に下回らないライン:**

- タイトル: 40pt（これ以下は後方の聴衆に見えない）
- 本文: 18pt（これ以下は読めない）
- キャプション: 14pt（これ以下は存在する意味がない）

### フォント指定

```css
:root {
  --font-ja: "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif;
  --font-en: "Inter", "Helvetica Neue", sans-serif;
}

/* 日本語テキスト */
.reveal {
  font-family: var(--font-ja);
}

/* 英数字・数字強調 */
.number-highlight,
.en-text {
  font-family: var(--font-en);
}
```

- **日本語**: Noto Sans JP（ウェイト: Regular 400, Bold 700, Black 900）
- **英数字**: Inter（特に数字強調時。ウェイト: Bold 700, Black 900）
- **数字強調**: 必ず Inter font で表示し、日本語テキストと視覚的に差別化する

### 行間・文字数

- **行間**: font-size x 1.4-1.6（チラシの1.2-1.4より広め。読みやすさ重視）
- **1スライドの文字数**: 最大50文字程度（タイトル除く）
- **箇条書き**: 最大5項目、各項目10語以内
- **タイトル**: 最大15文字程度

```css
.reveal .slides {
  line-height: 1.5;
}

.reveal .slides h1,
.reveal .slides h2 {
  line-height: 1.3;
}
```

---

## 3. 色とコントラスト

### 投影環境の注意

投影環境（プロジェクター）では色が20-30%薄く見える。
これを前提にコントラストを高めに設計する。

### WCAG基準

テキストと背景のコントラスト比は **4.5:1 以上**を確保する。

| 組み合わせ | コントラスト比 | 判定 |
| --- | --- | --- |
| 白テキスト (#FFFFFF) on 黒背景 (#000000) | 21:1 | OK |
| 白テキスト (#FFFFFF) on 濃紺 (#1a1a2e) | 15.4:1 | OK |
| 薄灰テキスト (#999999) on 白背景 (#FFFFFF) | 2.8:1 | NG |
| 黄テキスト (#FFD700) on 白背景 (#FFFFFF) | 1.3:1 | NG |

### 3色ルール

スライド全体の配色は3色で構成する。

```
背景色 (70%) -- スライドの大部分を占める基調色
メインカラー (25%) -- テキスト、アイコン、重要な要素
アクセントカラー (5%) -- CTA、強調、数字ハイライト
```

```css
/* ダークテーマ例 */
:root {
  --bg-primary: #0D1117;       /* 背景色 70% */
  --text-primary: #E6EDF3;     /* メインカラー 25% */
  --accent: #3B82F6;           /* アクセント 5% */
}

/* ライトテーマ例 */
:root {
  --bg-primary: #FFFFFF;       /* 背景色 70% */
  --text-primary: #1F2937;     /* メインカラー 25% */
  --accent: #2563EB;           /* アクセント 5% */
}
```

### 避けるべき色

- **緑テキスト**: プロジェクターで不安定（色再現性が低い）
- **赤と緑の組み合わせ**: 色覚多様性への配慮
- **低コントラストの薄い色**: 投影で見えなくなる

### ダークテーマ

- 暗い部屋で目に優しい
- 洗練された印象、テック系・高級感
- 写真が映える（黒背景はフレーム効果）
- 注意: 文字色は `#FFFFFF` ではなく `#E6EDF3` 程度に（まぶしさ軽減）

### ライトテーマ

- 明るい部屋で視認性が高い
- 信頼感、クリーンな印象
- 印刷配布にも対応しやすい
- 注意: 文字色は `#000000` ではなく `#1F2937` 程度に（コントラスト過剰を回避）

---

## 4. レイアウトとスペーシング

### 基本数値

```css
.reveal .slides section {
  width: 1920px;
  height: 1080px;
  padding: 60px;  /* 最低パディング */
}
```

| 項目 | 最小値 | 推奨値 |
| --- | --- | --- |
| スライド内パディング | 60px | 80-100px |
| 要素間ギャップ | 30px | 40-60px |
| タイトルと本文の間隔 | 30px | 40px |
| 箇条書き行間 | 20px | 30px |

### 余白の原則

- **スライド面積の20%以上は空白にする**
- 余白は「何もない空間」ではなく「情報に呼吸を与える空間」
- 余白が多いほど、残った要素のインパクトが増す

### 揃えの原則

- **中央揃え or 左揃えを選択し、スライド全体で統一する**（混在させない）
- タイトルスライド、セクション区切り、引用: 中央揃え
- テキスト+画像、箇条書き: 左揃え
- Flexboxで上下左右の中央揃えを徹底

```css
/* 中央揃えの基本パターン */
.slide-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 左揃え + 垂直中央の基本パターン */
.slide-left-aligned {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
}
```

---

## 5. 画像の使い方

### 画像の使用パターン

| パターン | 説明 | インパクト |
| --- | --- | --- |
| フルブリード | 画像をスライド全面に敷く | 最大 |
| ハーフ分割 | 左右 or 上下の50/50分割 | 大 |
| 部分配置 | スライドの一部に配置 | 中 |
| アイコン | 小さなSVGアイコン | 補助的 |

### 画像の解像度

| 使用方法 | 最低解像度 |
| --- | --- |
| フルブリード（全面） | 1920x1080px |
| ハーフ分割 | 960x1080px（横半分）or 1920x540px（縦半分） |
| 部分配置 | 配置サイズの2倍のピクセル数 |

### CSS実装

```css
/* フルブリード画像 */
.slide-fullbleed {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 画像にオーバーレイ */
.slide-fullbleed::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);  /* 暗めのオーバーレイ */
}

/* ハーフ分割 */
.slide-half {
  display: flex;
}
.slide-half .image-side {
  flex: 1;
  background-size: cover;
  background-position: center;
}
.slide-half .text-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
}

/* 画像のアスペクト比維持 */
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```

### アイコンの統一

- 一貫したスタイルで統一する（stroke系 or fill系のどちらかに統一）
- サイズを統一する（同一スライド内では同じサイズ）
- 色をアクセントカラーに統一する
- 全てインラインSVGで実装する（絵文字禁止）

---

## 6. 9種のスライドタイプ詳細

### タイプ1: タイトルスライド

**用途**: プレゼンテーションの開始。メインタイトル、サブタイトル、ロゴ/発表者名を配置。

```
+----------------------------------------------+
|                                              |
|                                              |
|                                              |
|              [MAIN TITLE]                    |
|              60pt+ / Bold                    |
|                                              |
|              [Subtitle]                      |
|              24pt / Regular                  |
|                                              |
|                                              |
|                                   [LOGO]     |
|                                              |
+----------------------------------------------+
```

```css
.slide-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px;
}
.slide-title h1 {
  font-size: 60pt;
  font-weight: 900;
  margin-bottom: 20px;
}
.slide-title .subtitle {
  font-size: 24pt;
  font-weight: 400;
  opacity: 0.8;
}
.slide-title .logo {
  position: absolute;
  bottom: 60px;
  right: 80px;
  height: 60px;
}
```

**良い例**: タイトルが明快、余白たっぷり、ロゴは控えめに右下
**悪い例**: タイトルに加えて目次や自己紹介まで詰め込む

---

### タイプ2: セクション区切り

**用途**: 話の大きな転換点。新しいセクションの開始を示す。

```
+----------------------------------------------+
|                                              |
|                                              |
|                                              |
|                                              |
|          [SECTION TITLE]                     |
|          48pt+ / Bold                        |
|          アクセントカラー背景                  |
|                                              |
|                                              |
|                                              |
|                                              |
+----------------------------------------------+
```

```css
.slide-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--accent);
  color: #FFFFFF;
}
.slide-section h2 {
  font-size: 48pt;
  font-weight: 900;
}
```

**良い例**: テキスト1つだけ、背景色で視覚的にブレイク
**悪い例**: セクション説明の文章を追加、アイコンを並べる

---

### タイプ3: テキスト+画像

**用途**: 説明テキストとビジュアルを組み合わせて伝える。最も汎用的なタイプ。

```
左右分割:
+----------------------------------------------+
|                      |                        |
|  [TITLE]             |                        |
|  32pt+ / Bold        |      [IMAGE]           |
|                      |      object-fit:cover   |
|  [Body text]         |                        |
|  18-24pt             |                        |
|                      |                        |
+----------------------------------------------+

上下分割:
+----------------------------------------------+
|                                              |
|            [IMAGE - 上部60%]                  |
|            object-fit: cover                 |
|                                              |
|----------------------------------------------+
|  [TITLE]               [Body text]           |
|  32pt+ / Bold          18-24pt               |
+----------------------------------------------+
```

```css
/* 左右分割 */
.slide-text-image {
  display: flex;
  align-items: stretch;
}
.slide-text-image .text-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
}
.slide-text-image .image-side {
  flex: 1;
  background-size: cover;
  background-position: center;
}
.slide-text-image h3 {
  font-size: 32pt;
  font-weight: 700;
  margin-bottom: 20px;
}
.slide-text-image p {
  font-size: 20pt;
  line-height: 1.5;
}
```

**良い例**: テキスト側は3-4行以内、画像が高解像度、左右のバランスが均等
**悪い例**: テキスト側に箇条書き10項目、画像が小さくて余白だらけ

---

### タイプ4: フルブリード画像

**用途**: 視覚的インパクト最大。感情に訴える場面、導入、転換点で使用。

```
+----------------------------------------------+
|                                              |
|     [FULL-WIDTH IMAGE]                       |
|     background-size: cover                   |
|                                              |
|     +----------------------------------+     |
|     | [TEXT OVERLAY]                    |     |
|     | 40pt+ / Bold / text-shadow       |     |
|     +----------------------------------+     |
|                                              |
|                                              |
+----------------------------------------------+
```

```css
.slide-fullbleed {
  position: relative;
  background-size: cover;
  background-position: center;
}
.slide-fullbleed::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
.slide-fullbleed .content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px;
  height: 100%;
}
.slide-fullbleed h3 {
  font-size: 40pt;
  font-weight: 900;
  color: #FFFFFF;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
```

**良い例**: 高解像度の写真、テキストは短く、オーバーレイでコントラスト確保
**悪い例**: 低解像度でぼやけた画像、テキストが長すぎてオーバーレイが重い

---

### タイプ5: 数字強調

**用途**: KPI、統計データ、実績数値など、数字でインパクトを与える場面。

```
+----------------------------------------------+
|                                              |
|                                              |
|              [LABEL]                         |
|              18pt / Muted                    |
|                                              |
|             [NUMBER]                         |
|            120pt+ / Inter Bold               |
|                                              |
|           [DESCRIPTION]                      |
|            24pt / Regular                    |
|                                              |
|                                              |
+----------------------------------------------+
```

```css
.slide-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.slide-number .label {
  font-size: 18pt;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.slide-number .number {
  font-family: "Inter", sans-serif;
  font-size: 120pt;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 20px;
}
.slide-number .description {
  font-size: 24pt;
  font-weight: 400;
  max-width: 800px;
}
```

**良い例**: 数字1つが圧倒的に大きい、ラベルと説明は控えめ
**悪い例**: 数字が3つ以上並ぶ（それは比較タイプを使う）、説明が長い

---

### タイプ6: 比較/2カラム

**用途**: Before/After、メリット/デメリット、2つの選択肢の対比。

```
+----------------------------------------------+
|                                              |
|          [COMPARISON TITLE]                  |
|          32pt+ / Bold                        |
|                                              |
|  +------------------+  +------------------+  |
|  |                  |  |                  |  |
|  |  [COLUMN A]      |  |  [COLUMN B]      |  |
|  |  Title 24pt      |  |  Title 24pt      |  |
|  |                  |  |                  |  |
|  |  - Item 1        |  |  - Item 1        |  |
|  |  - Item 2        |  |  - Item 2        |  |
|  |  - Item 3        |  |  - Item 3        |  |
|  |                  |  |                  |  |
|  +------------------+  +------------------+  |
|                                              |
+----------------------------------------------+
```

```css
.slide-comparison {
  display: flex;
  flex-direction: column;
  padding: 80px;
}
.slide-comparison h3 {
  font-size: 32pt;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
}
.slide-comparison .columns {
  display: flex;
  gap: 60px;
  flex: 1;
  align-items: center;
}
.slide-comparison .column {
  flex: 1;
  padding: 40px;
}
.slide-comparison .column h4 {
  font-size: 24pt;
  font-weight: 700;
  margin-bottom: 20px;
}
.slide-comparison .column li {
  font-size: 20pt;
  line-height: 1.6;
}
```

**良い例**: 2カラムで対称的に配置、各カラム3-5項目以内
**悪い例**: 3カラム以上（複雑すぎる）、項目が多すぎて読めない

---

### タイプ7: フロー/ステップ

**用途**: プロセス、手順、タイムライン、ワークフローの可視化。

```
+----------------------------------------------+
|                                              |
|          [FLOW TITLE]                        |
|          32pt+ / Bold                        |
|                                              |
|  +------+     +------+     +------+          |
|  |      |     |      |     |      |          |
|  | Step |---->| Step |---->| Step |          |
|  |  1   |     |  2   |     |  3   |          |
|  |      |     |      |     |      |          |
|  +------+     +------+     +------+          |
|  [Label]      [Label]      [Label]           |
|                                              |
+----------------------------------------------+
```

```css
.slide-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
}
.slide-flow h3 {
  font-size: 32pt;
  font-weight: 700;
  margin-bottom: 60px;
}
.slide-flow .steps {
  display: flex;
  align-items: center;
  gap: 40px;
}
.slide-flow .step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}
.slide-flow .step-number {
  font-family: "Inter", sans-serif;
  font-size: 48pt;
  font-weight: 900;
  color: var(--accent);
  margin-bottom: 16px;
}
.slide-flow .step-label {
  font-size: 20pt;
  font-weight: 700;
}
.slide-flow .step-desc {
  font-size: 16pt;
  color: var(--text-muted);
  margin-top: 8px;
}
/* ステップ間の矢印 */
.slide-flow .arrow {
  width: 40px;
  height: 2px;
  background: var(--text-muted);
  position: relative;
  flex-shrink: 0;
}
.slide-flow .arrow::after {
  content: "";
  position: absolute;
  right: -6px;
  top: -5px;
  border: 6px solid transparent;
  border-left-color: var(--text-muted);
}
```

**良い例**: 3-5ステップ、各ステップはラベル+1行の説明
**悪い例**: 6ステップ以上（スライドを分割する）、各ステップに長い説明文

---

### タイプ8: 引用/キーメッセージ

**用途**: 重要なメッセージ、顧客の声、格言、結論の強調。

```
+----------------------------------------------+
|                                              |
|                                              |
|                                              |
|        "  [QUOTE TEXT]  "                    |
|           36pt+ / Italic or Bold             |
|                                              |
|                                              |
|           -- [Attribution]                   |
|              20pt / Regular                  |
|                                              |
|                                              |
|                                              |
+----------------------------------------------+
```

```css
.slide-quote {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px;
}
.slide-quote blockquote {
  font-size: 36pt;
  font-weight: 700;
  line-height: 1.4;
  max-width: 1200px;
  position: relative;
}
.slide-quote blockquote::before {
  content: open-quote;
  font-size: 80pt;
  color: var(--accent);
  position: absolute;
  top: -40px;
  left: -40px;
  opacity: 0.3;
}
.slide-quote .attribution {
  font-size: 20pt;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 30px;
}
```

**良い例**: テキスト1つが中央に大きく、余白がたっぷり
**悪い例**: 引用文が長すぎる（3行以上）、属性情報が複雑

---

### タイプ9: CTA/クロージング

**用途**: プレゼン最後の行動喚起。連絡先、次のステップ、QRコードを配置。

```
+----------------------------------------------+
|                                              |
|                                              |
|          [CTA MESSAGE]                       |
|          40pt+ / Bold                        |
|                                              |
|          [Sub-message]                       |
|          24pt / Regular                      |
|                                              |
|  +--------+                                  |
|  |  QR    |    name@example.com              |
|  |  CODE  |    090-XXXX-XXXX                 |
|  +--------+    https://example.com           |
|                                              |
+----------------------------------------------+
```

```css
.slide-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px;
}
.slide-cta h3 {
  font-size: 40pt;
  font-weight: 900;
  margin-bottom: 16px;
}
.slide-cta .sub-message {
  font-size: 24pt;
  font-weight: 400;
  margin-bottom: 60px;
  color: var(--text-muted);
}
.slide-cta .contact {
  display: flex;
  align-items: center;
  gap: 40px;
}
.slide-cta .qr-code {
  width: 160px;
  height: 160px;
}
.slide-cta .contact-info {
  text-align: left;
  font-size: 20pt;
  line-height: 1.8;
}
```

**良い例**: CTA1つが明確、連絡先は最小限、QRコードで導線確保
**悪い例**: CTAが複数ある、連絡先情報が多すぎる、「ありがとうございました」だけで終わる

---

## 7. アニメーションとトランジション

### 基本方針

- アニメーションは**控えめに**。内容に集中させることが最優先
- 過度なアニメーションは「プレゼンの中身が薄い」印象を与える

### Reveal.jsのトランジション設定

```javascript
Reveal.initialize({
  transition: 'slide',      // デフォルト: slide（シンプル）
  transitionSpeed: 'default',
  backgroundTransition: 'fade',
});
```

**推奨トランジション:**

| トランジション | 用途 |
| --- | --- |
| `slide` | デフォルト。シンプルで邪魔にならない |
| `fade` | 静かな転換。フルブリード画像間の切り替え |
| `none` | 最速。テンポの良いプレゼン向き |

**避けるべきトランジション:**

- `zoom`: 派手すぎる
- `convex` / `concave`: 3D効果は内容の邪魔

### Fragment（段階表示）

テキストや箇条書きを1つずつ表示する場合に使用。

```html
<ul>
  <li class="fragment">ポイント1</li>
  <li class="fragment">ポイント2</li>
  <li class="fragment">ポイント3</li>
</ul>
```

**注意**: PDF出力時はアニメーション/フラグメントが無効になる（全要素が表示された状態で出力）。PDF配布を前提とする場合は、全要素が同時に表示されても成立するレイアウトにすること。

---

## 8. スピーカーノート

### 基本ルール

- **全スライドにスピーカーノートを記載する**
- ノートには、スライドに書かない詳細情報を記載する
- プレゼンターが口頭で補足する内容の台本として機能させる

### Reveal.js形式

```html
<section>
  <h2>スライドタイトル</h2>
  <p>キーメッセージ</p>

  <aside class="notes">
    このスライドでは◯◯について説明します。
    ポイントは3つ:
    1. △△の背景
    2. □□のデータ（具体的な数字: XX%の改善）
    3. ◇◇の結論
    質問が出やすいポイント: ◎◎について
  </aside>
</section>
```

### ノートに含めるべき内容

- **口頭で補足する詳細情報**（スライドには書かない具体的なデータや事例）
- **話す順序のガイド**（「まず◯◯から話し始め、次に△△へ」）
- **想定質問と回答**（聴衆から出そうな質問への備え）
- **時間の目安**（このスライドに何分かけるか）

### プレゼンターモードの起動

```javascript
// Reveal.js でプレゼンターモードを開く
// ブラウザで 's' キーを押す
```

---

## 9. チェックリスト

スライドHTMLを書いたら、以下を全て確認する。

### メッセージ

- [ ] 各スライドが1メッセージか（複数トピック詰め込みなし）
- [ ] 3秒でメッセージが伝わるか
- [ ] 1スライドの文字数が50文字以内か（タイトル除く）

### タイポグラフィ

- [ ] タイトルが40pt以上か
- [ ] 本文が18pt以上か
- [ ] キャプションが14pt以上か
- [ ] 箇条書きが5項目以内か
- [ ] 各項目が10語以内か
- [ ] Noto Sans JP + Inter の組み合わせか

### ビジュアル

- [ ] 絵文字が使われていないか（全てSVGアイコンか）
- [ ] 画像が高解像度か（フルブリード時1920x1080px以上）
- [ ] アイコンスタイルが統一されているか（stroke系 or fill系）
- [ ] object-fit: cover でアスペクト比が維持されているか

### 色・コントラスト

- [ ] コントラスト比が4.5:1以上か
- [ ] 全スライドで配色が統一されているか（3色ルール）
- [ ] 投影環境でも視認できるコントラストか

### レイアウト

- [ ] 余白が十分か（面積20%以上が空白）
- [ ] 揃え方向が統一されているか（中央 or 左で混在なし）
- [ ] 16:9アスペクト比が維持されているか
- [ ] パディングが60px以上確保されているか

### スピーカーノート

- [ ] 全スライドにスピーカーノートが記載されているか
- [ ] ノートに口頭補足情報が含まれているか

### PDF出力

- [ ] ?print-pdf モードで全スライドが表示されるか
- [ ] fragment が全て表示された状態で成立するか
- [ ] 高画質設定（deviceScaleFactor:2, 600dpi）で出力したか

---

## Reveal.js 基本構造リファレンス

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プレゼンテーションタイトル</title>
  <link rel="stylesheet" href="reveal.js/dist/reveal.css">
  <link rel="stylesheet" href="reveal.js/dist/theme/black.css">
  <style>
    :root {
      --bg-primary: #0D1117;
      --text-primary: #E6EDF3;
      --accent: #3B82F6;
    }
    .reveal .slides section {
      width: 1920px;
      height: 1080px;
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">

      <!-- タイプ1: タイトルスライド -->
      <section>
        <h1>メインタイトル</h1>
        <p class="subtitle">サブタイトル</p>
        <aside class="notes">オープニングの挨拶と自己紹介。</aside>
      </section>

      <!-- タイプ2: セクション区切り -->
      <section data-background-color="var(--accent)">
        <h2>セクション名</h2>
        <aside class="notes">新しいセクションへの導入。</aside>
      </section>

      <!-- タイプ5: 数字強調 -->
      <section>
        <p class="label">売上成長率</p>
        <p class="number">250%</p>
        <p class="description">前年同期比での成長</p>
        <aside class="notes">具体的な数字の背景を説明。</aside>
      </section>

      <!-- タイプ9: CTA/クロージング -->
      <section>
        <h3>お気軽にお問い合わせください</h3>
        <p class="sub-message">まずは無料相談から</p>
        <aside class="notes">クロージング。名刺交換の案内。</aside>
      </section>

    </div>
  </div>
  <script src="reveal.js/dist/reveal.js"></script>
  <script>
    Reveal.initialize({
      hash: true,
      transition: 'slide',
      width: 1920,
      height: 1080,
    });
  </script>
</body>
</html>
```
