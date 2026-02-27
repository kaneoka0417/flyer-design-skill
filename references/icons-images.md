# アイコン・イラスト・画像ガイド

## 絵文字は絶対禁止

絵文字（:books:, :wrench:, :sparkles:, :calendar:, :pushpin:, :fire: 等）は**印刷チラシで一切使わない**。

理由:
- 環境依存で見た目が変わる
- 印刷時に色がずれる/潰れる
- プロっぽくない
- Webチャット/Slack感が出る

**全てインラインSVGアイコンで置換すること。例外なし。**

---

## チラシ頻出SVGアイコン集

以下はチラシでよく使うアイコン。そのままHTMLにコピーして使用可能。
stroke系のため、`currentColor` で色が変わる。

### 基本CSSスタイル

```css
.icon-inline svg {
  width: 4.5mm;
  height: 4.5mm;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: middle;
  flex-shrink: 0;
}
```

### カレンダー（日時）

```html
<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
```

### マップピン（場所）

```html
<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
```

### ユーザーグループ（参加者・講師）

```html
<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
```

### 時計（時間）

```html
<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
```

### チェックマーク（特典・確認）

```html
<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
```

### チェックサークル

```html
<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
```

### 電話

```html
<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
```

### メール

```html
<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
```

### 矢印右（フローの接続）

```html
<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
```

### スター（特典・おすすめ）

```html
<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
```

---

## フリーアイコンソース（商用可）

### SVGアイコン（推奨）

高品質、サイズ自由、色も変更可能。印刷に最適。

**Heroicons** (MIT)
- https://heroicons.com/
- シンプル、モダン、ビジネス向け

**Tabler Icons** (MIT)
- https://tabler-icons.io/
- 4000+アイコン、線が細め

**Lucide** (ISC)
- https://lucide.dev/
- Feather Iconsの後継

**Font Awesome** (部分無料)
- https://fontawesome.com/
- 定番、種類豊富

---

## フリーイラスト（商用可）

### 日本語対応

**いらすとや**
- https://www.irasutoya.com/
- 日本で最も有名、親しみやすい

**イラストAC**
- https://www.ac-illust.com/
- 要登録、種類豊富

**ソコスト**
- https://soco-st.com/
- ビジネス向け、シンプル

### 海外（高品質）

**unDraw**
- https://undraw.co/
- SVG、色変更可能、モダン

**Storyset**
- https://storyset.com/
- アニメーション可、色変更可

---

## フリー写真（商用可）

**Unsplash**
- https://unsplash.com/
- 高品質、プロ写真

**Pexels**
- https://www.pexels.com/
- 日本語検索可

**写真AC**
- https://www.photo-ac.com/
- 日本人モデル多い

---

## チラシでの使い分け

| 種類 | 役割 | 配置場所 |
| --- | --- | --- |
| **写真** | 信頼感、リアリティ | ヘッダー、人物紹介、実績 |
| **イラスト** | 親しみ、わかりやすさ | 説明、フロー図、特徴 |
| **SVGアイコン** | 区別、視線誘導 | 見出し横、リスト、ラベル、バッジ内 |

### サイズの目安

- アイコン（見出し横）: 4-5mm (約14-18pt)
- アイコン（ブレット）: 3mm (約10pt)
- アイコン（バッジ内）: 4.5mm
- イラスト（特徴ブロック）: 15-25mm
- 写真（メイン）: 幅50%以上、高さ最低20mm

---

## 画像の注意点

### 解像度

- 印刷用: **350dpi以上**
- Web用72dpiはNG（ぼやける）

### ファイル形式

- 写真: JPG（軽い）
- イラスト/アイコン: SVG or PNG（透過）

### 著作権

- 必ずライセンス確認
- クレジット必要な場合あり
- 加工可否を確認
