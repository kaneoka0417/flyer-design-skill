# チラシデザインシステム

HTMLで印刷チラシを作る際の、チラシ専用デザインガイドライン。
Web LP のデザイン語彙（カードUI、コンポーネント等）を持ち込まないための指針。

---

## 絶対ルール（非交渉）

1. **絵文字禁止** -- テンプレート・成果物に絵文字を一切使わない。全てインラインSVGアイコンで置換する
2. **カードUI禁止** -- `border-radius` + `border` + `box-shadow` の組み合わせは使わない（丸形バッジの `border-radius: 50%` は可）
3. **数字は突出表示** -- 価格・人数・期間などの数字は周囲テキストの2-4倍のフォントサイズにする
4. **3つ以上同じ見た目のブロック禁止** -- 各セクションの見た目を変える。同一CSSクラスの反復不可
5. **統一感は区切り線で保つ** -- 1ブロックだけ完全に違う背景色にしない。薄い区切り線（0.3mm solid）で分離しつつ統一感を維持
6. **視覚バランス必須** -- flexbox の align-items/justify-content で上下左右の中央揃えを徹底

---

## 大原則: チラシは「1枚の絵」である

チラシは Web コンポーネントの集合体ではない。
紙面全体が一つのビジュアルとして成立し、どこからでも読み始められる。

- LP: セクションを上から下へスクロールして追う（線的）
- チラシ: 一枚を面的に見て、興味のある場所に目が飛ぶ（面的）

### チラシ vs Web LP の根本的違い

| 項目 | 印刷チラシ | Web LP |
| --- | --- | --- |
| 密度 | 高い（詰め込む） | 低い |
| 余白 | 少ない（もったいない） | 多い（意図的に活用） |
| レイアウト | 分割・ブロック型 | 縦スクロール型 |
| 閲覧パターン | 面的（興味ある所に目が飛ぶ） | 線的（上から下へ誘導） |
| インパクト | 装飾的（派手に目立つ） | 内容的（共感・ストーリー） |
| 制約 | A4等の固定サイズに収める | 縦に無限に伸ばせる |

### Web vs チラシ CSS数値比較

| 項目 | Web LP | 印刷チラシ |
| --- | --- | --- |
| container padding | 15-20mm | **5-6mm** |
| section margin | 15-20mm | **2-4mm** |
| grid gap | 10-15mm | **2-3mm** |
| block padding | 10-15mm | **3-4mm** |
| line-height | 1.6-1.8 | **1.2-1.4** |
| 本文フォント | 14-16px | **8-9pt** |

---

## LP化 NGリスト（チラシで絶対やらないこと）

| NG | なぜNG | 代わりにこうする |
| --- | --- | --- |
| `border-radius` + `border` + `box-shadow` のカード | WebのコンポーネントUI感 | 色面（背景色の切り替え）でゾーン分け |
| `justify-content: space-between` で均等配置 | Web layout engine 感 | 意図的なゾーン比率で配置 |
| 同じカードデザインの3列・4列反復 | LP のfeatureセクション感 | ブロックごとに見た目を変える |
| 全面単色背景（#0D1117一色） | Webのダークモード感 | 複数の色面で紙面を構成 |
| 控えめなグラデ・微妙なシャドウ | Web UIの「洗練」=チラシの「地味」 | 大胆なコントラスト・装飾 |
| SVGアイコン + テキストの等間隔反復 | UI componentライブラリ感 | 写真・イラスト・文字装飾で変化 |
| セクション間の均一な余白 | スクロールUI的な空間設計 | ゾーンを隙間なく配置 |
| 絵文字アイコン（:calendar:, :pushpin: 等） | Webチャット/Slack感 | インラインSVGアイコンで置換 |

---

## チラシらしさ 6要素と CSS実装

### 1. 色面（カラーブロッキング）

枠線やカード境界線ではなく、**背景色の切り替え**でゾーンを分ける。
紙面は3-4色のゾーンで構成される。

```css
/* NG: カード枠線でゾーン分け */
.card {
  border: 0.3mm solid #30363D;
  border-radius: 2mm;
  background: #161B22;
}

/* OK: 色面でゾーン分け */
.zone-dark {
  background: #0D1117;
  padding: 4mm 5mm;
}
.zone-gold {
  background: linear-gradient(135deg, #D4920B, #B87A08);
  padding: 4mm 5mm;
  color: #fff;
}
.zone-mid {
  background: #161B22;
  padding: 4mm 5mm;
}
```

**レイアウト例（3ゾーン構成）:**

```
+------------------------------+
| ██████ ゾーン1: 濃色 ██████ | <- キャッチ・写真
| ██████ (紙面の30-40%) ██████ |
+------------------------------+
|       ゾーン2: 中間色        | <- メインコンテンツ
|       (紙面の35-45%)        |
+------------------------------+
| ▓▓▓▓ ゾーン3: アクセント ▓▓▓ | <- CTA・連絡先
| ▓▓▓▓ (紙面の20-25%) ▓▓▓▓▓ |
+------------------------------+
```

### 2. 見出し装飾

チラシの見出しは Web の `<h2>` とは別物。
紙面の**視覚的アンカー**として機能する。

```css
/* パターンA: 帯見出し（色面の中の小帯） */
.heading-obi {
  background: #D4920B;
  color: #fff;
  display: inline-block;
  padding: 1mm 4mm;
  font-size: 11pt;
  font-weight: 900;
  margin-bottom: 2mm;
}

/* パターンB: 下線アクセント見出し */
.heading-underline {
  font-size: 13pt;
  font-weight: 900;
  color: #fff;
  padding-bottom: 1.5mm;
  border-bottom: 0.8mm solid #D4920B;
  display: inline-block;
  margin-bottom: 2mm;
}

/* パターンC: 背景色つきブロック見出し */
.heading-block {
  background: rgba(212, 146, 11, 0.15);
  padding: 1.5mm 4mm;
  font-size: 12pt;
  font-weight: 900;
  color: #fff;
  margin-bottom: 2mm;
}

/* パターンD: 番号つき見出し */
.heading-numbered::before {
  content: attr(data-num);
  display: inline-block;
  background: #D4920B;
  color: #fff;
  width: 6mm;
  height: 6mm;
  line-height: 6mm;
  text-align: center;
  border-radius: 50%;
  font-size: 9pt;
  font-weight: 900;
  margin-right: 2mm;
  vertical-align: middle;
}
```

### 3. 情報ブロック（カードの代替）

カード（枠線+角丸+影）ではなく、以下のパターンで情報をグループ化する。

```css
/* パターンA: 色面ブロック（枠線なし） */
.info-block {
  background: #161B22;
  padding: 3mm 4mm;
  /* border なし、border-radius なし、box-shadow なし */
}

/* パターンB: 左アクセントライン（太め・短め） */
.info-accent {
  padding-left: 3mm;
  border-left: 1.2mm solid #D4920B;
}

/* パターンC: 背景グラデーションで区別 */
.info-gradient {
  background: linear-gradient(90deg, rgba(212,146,11,0.1) 0%, transparent 60%);
  padding: 2mm 4mm;
}

/* パターンD: テーブル風（チラシの定番） */
.info-table {
  display: grid;
  grid-template-columns: 25mm 1fr;
  gap: 0;
}
.info-table dt {
  background: #D4920B;
  color: #fff;
  padding: 1mm 2mm;
  font-size: 8pt;
  font-weight: 700;
}
.info-table dd {
  background: #161B22;
  padding: 1mm 3mm;
  font-size: 9pt;
}

/* パターンE: 薄い区切り線で分離（統一感を保つ） */
.features-row {
  display: flex;
  align-items: stretch;
}
.features-row > *:not(:last-child) {
  border-right: 0.3mm solid #30363D;
}
.features-row > * {
  flex: 1;
  padding: 0 3mm;
}

/* パターンF: 数字主役ブロック */
.info-number-led {
  display: flex;
  align-items: center;
  gap: 2mm;
}
.info-number-led .number {
  font-family: "Inter", sans-serif;
  font-size: 28pt;
  font-weight: 900;
  color: #D4920B;
  line-height: 1;
  flex-shrink: 0;
}
```

**カード vs 情報ブロックの違い:**

```
[カード（NG）]              [情報ブロック（OK）]
+-------------------+        ██████████████████
|  border + radius  |        ██ 色面で区別  ██
|  box-shadow       |        ██ 枠線なし    ██
|  個別に浮いてる   |        ██████████████████
+-------------------+
                             <- 背景色が直接切り替わる
```

### 4. テキスト装飾

チラシでは文字自体が装飾要素。Web の控えめなテキストスタイルとは異なる。

```css
/* 強調テキスト: 背景色マーカー */
.text-marker {
  background: linear-gradient(transparent 60%, rgba(212,146,11,0.3) 60%);
  font-weight: 700;
}

/* 数字の強調（価格・日数など） */
.text-number {
  font-family: "Inter", sans-serif;
  font-size: 1.8em; /* 周囲の1.8倍 */
  font-weight: 800;
  color: #D4920B;
  line-height: 1;
}

/* キャッチの一部を色で強調 */
.text-accent {
  color: #D4920B;
  font-weight: 900;
}

/* 小さな補足テキスト */
.text-note {
  font-size: 7pt;
  color: #8B949E;
}
```

### 5. 紙面レイアウト（ゾーン配置）

`justify-content: space-between` ではなく、
各ゾーンに**意図的な高さ比率**を割り当てる。

```css
/* NG: 均等配置（LP的） */
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* <- 機械的 */
}

/* OK: ゾーンに意図的な比率 */
body {
  display: flex;
  flex-direction: column;
}
.zone-header { height: 100mm; }  /* 紙面の約1/3 */
.zone-main { flex: 1; }          /* 残り全部 */
.zone-cta { height: 55mm; }      /* 紙面の約1/5 */
/* ゾーン間の余白は 0 ~ 2mm（隙間なく繋げる） */
```

### 6. 数字の強調表現

チラシでは数字が最も強い視覚的アンカーになる。
数字は必ず Inter font（欧文書体）で表示し、日本語テキストと視覚的に差別化する。

| 用途 | 倍率 | 例 |
| --- | --- | --- |
| 価格 | 本文の3-4倍 | 本文9pt -> 価格32pt |
| 比率・数量 | 本文の2-3倍 | 本文9pt -> "2:1" 28pt |
| 期間 | 本文の2倍 | 本文9pt -> "3" 22pt + "ヶ月" 9pt |

```css
/* 価格の強調 */
.price-huge {
  font-family: "Inter", sans-serif;
  font-size: 32pt;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

/* 比率の強調 */
.ratio-huge {
  font-family: "Inter", sans-serif;
  font-size: 28pt;
  font-weight: 900;
  color: #D4920B;
  line-height: 1;
}

/* 期間の強調（数字だけ大きく） */
.period-huge {
  font-family: "Inter", sans-serif;
  font-size: 22pt;
  font-weight: 900;
  color: #D4920B;
  line-height: 1;
}
.period-unit {
  font-size: 9pt;
  color: #8B949E;
}
```

---

## セクションの多様性と統一感

各コンテンツブロックは見た目を変えるが、以下で統一感を保つ:

- 同じアクセントカラーを全ブロックに通す
- ゾーン間は 0-2mm の gap or 薄い区切り線 (0.3mm solid) で繋ぐ
- 1つのブロックだけ完全に違う背景色にしない（濃淡の段階的変化で）

```
NG: 3つの特徴ブロックが全て同じ background + border-left + icon + text
NG: 1ブロックだけゴールド背景、残り2つはダーク背景（浮いて見える）

OK: 特徴1は大きな数字主役、特徴2はテキスト主役、特徴3は数字+テキスト混合
    3つとも同じ背景色で、薄い縦線(0.3mm)で区切り、統一感を維持
```

---

## 視覚バランスのルール

- **上下中央揃え**: `display: flex; align-items: center` で縦方向のバランスを確保
- **ゾーン内中央**: `display: flex; flex-direction: column; justify-content: center` でゾーン内コンテンツを中央配置
- **ヘッダー~コンテンツ~フッター均等**: 上部と下部の余白が偏らないよう均等化
- **写真と文字のバランス**: ヒーローゾーンで写真50%+テキスト50%の場合、テキスト側もflex centerで縦中央

---

## ダークテーマ x チラシ の注意点

ダークテーマ自体は問題ない。問題は「Webのダークモード」にすること。

**ダーク x チラシ で必要なこと:**

- 1色ベタではなく、**濃淡3段階**で色面を構成
  - 最濃: `#0D1117`（キャッチ背景）
  - 中間: `#161B22`（情報ゾーン）
  - 浅い: `#1C2129` or `#21262D`（サブゾーン）
- **アクセントカラーを大胆に使う**
  - Webのように `opacity: 0.08` ではなく、ベタで色面を作る
  - ゴールド帯、ゴールド見出しブロック、ゴールド背景ゾーン
- **写真・イラストを大きく使う**
  - Web的な小さなアイコンではなく、ゾーン幅のビジュアル

参考画像のダークテーマ例（4枚）から学んだこと:

- **全面ダークは禁止。** ダークはヘッダーゾーン（30-40%）だけに使う
- ヘッダーゾーン内に**大きな写真**を配置し、暗い背景と一体化させる
- コンテンツゾーンは `#161B22`~`#1C2129`（暗すぎない中間色）
- CTAゾーンは**ゴールドやアクセント色**で明確に切り替え
- ゾーン間は余白0mm。色が直接切り替わることで「1枚の絵」になる

---

## A4チラシの情報設計

### 情報の優先順位

| 優先度 | 要素 | 扱い |
| --- | --- | --- |
| 高（必須） | WHAT: イベント名、商品名 | 最大・最初に目に入る |
| 高（必須） | BENEFIT: 得られる価値（50%OFF、プレゼント等） | 数字を突出表示 |
| 高（必須） | WHEN/WHERE: 日時、場所 | 明確な情報ブロック |
| 高（必須） | HOW: 連絡先、QRコード | CTA帯に配置 |
| 中 | WHO: 主催者情報 | ロゴ帯に集約 |
| 中 | TARGET: ターゲットを明確にするコピー | キャッチに統合 |
| 低 | 補足情報: 会社概要 | スペースがあれば |

### 面積配分の目安（A4）

```
+-----------------------------+
|  キャッチ・タイトル (20-25%)| <- 最大インパクト
|-----------------------------+
|                             |
|  メインコンテンツ (50-55%)  | <- 特徴、ベネフィット
|                             |
|-----------------------------+
|  CTA・連絡先     (20-25%)  | <- QR + 電話 + 価格
+-----------------------------+
```

### A4に収まらない時の削る順序

1. 会社概要、沿革 -> 削除
2. 詳細な説明文 -> 箇条書き1行に
3. 「こんな方に」セクション -> 削除 or 1行に
4. プログラム詳細 -> 簡略化
5. 複数の特典 -> 最重要1-2個に

**絶対に削らない:** タイトル/キャッチ、日時・場所、価格/参加費、連絡先/QR

---

## チラシ実装チェックリスト

チラシHTMLを書いたら、以下を確認:

- [ ] `border-radius` + `border` + `box-shadow` のカードUIがないか
- [ ] 絵文字が使われていないか（全てSVGアイコンか）
- [ ] 同じカードデザインが3つ以上並んでいないか
- [ ] `justify-content: space-between` で均等配置していないか
- [ ] 背景が全面1色になっていないか（色面は3つ以上あるか）
- [ ] 見出しが Web の `<h2>` 風（ただのテキスト）になっていないか
- [ ] アクセントカラーが控えめすぎないか（ベタの色面があるか）
- [ ] 数字（価格・人数・期間）が周囲テキストの2倍以上か
- [ ] 各セクションの見た目が異なるか（同一CSSクラスの反復なし）
- [ ] 上下/左右の中央揃えが適切か（偏りがないか）
- [ ] 紙面全体を見て「1枚の絵」として成立しているか
- [ ] LP的な「セクションの積み上げ」構成になっていないか

---

## 参考チラシ画像からの学び（11枚分析）

`references/chirasi-examples/` の参考画像から抽出した実践パターン。

### バッジ/スタンプ要素

チラシでは「参加無料」「150名限定」「特典プレゼント」等の情報をバッジとして表示する。
Webの控えめなラベルではなく、ベタの色面で目立たせる。

```css
/* バッジ: 角に配置するスタンプ要素 */
.badge-stamp {
  display: inline-block;
  background: #D4920B;
  color: #fff;
  font-size: 10pt;
  font-weight: 900;
  padding: 2mm 4mm;
  /* border-radius は使わない or 最小限（1mm程度） */
}

/* 丸形バッジ（人数制限等） */
.badge-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18mm;
  height: 18mm;
  border-radius: 50%;
  background: #D4920B;
  color: #fff;
  font-size: 9pt;
  font-weight: 900;
  text-align: center;
  line-height: 1.2;
}
```

### タイポグラフィの混合サイズ

同じ見出し内でフォントサイズを2-3倍変化させる。
キーワードだけ色を変えて視線を誘導する。

```css
/* 混合サイズの見出し例 */
.catch-mixed {
  font-weight: 900;
  line-height: 1.2;
}
.catch-mixed .small {
  font-size: 12pt;
  display: block;
}
.catch-mixed .large {
  font-size: 36pt;
  display: block;
  color: #D4920B; /* キーワードだけ色変え */
}
```

```html
<div class="catch-mixed">
  <span class="small">たった2日で作る</span>
  <span class="large">自社専用AIツール</span>
</div>
```

### コンタクトバンド（底部）

全参考画像で底部に全幅の色帯がある。ロゴ・電話番号・QRコードを配置。

```css
.contact-band {
  background: #0A0E13; /* or アクセント色 */
  padding: 3mm 5mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-radius なし。全幅で端まで伸ばす */
}
```

---

## フォントサイズ目安（A4チラシ）

| 要素 | サイズ | 備考 |
| --- | --- | --- |
| メインキャッチ | 28-42pt | 紙面の主役。最も大きく |
| サブキャッチ | 14-18pt | キャッチの補足 |
| セクション見出し | 11-14pt | 帯やブロックの見出し |
| 本文 | 8-10pt | 読みやすい最小ライン |
| 注釈・キャプション | 7-8pt | 控えめでOK |
| 価格・数字（強調） | 22-32pt | 突出させる。Inter font推奨 |
