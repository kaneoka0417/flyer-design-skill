---
name: nano-banana
description: AI画像生成ツール（Gemini）。チラシ・スライド用の写真・イラスト・装飾素材をAI生成。印刷品質（2K-4K）対応、スタイル転写、透過背景に対応。写真がない場合や追加素材が必要な場合に使用。
triggers:
  - "画像を生成"
  - "AI画像"
  - "nano-banana"
  - "ナノバナナ"
  - "素材を作って"
  - "generate image"
  - "create asset"
---

# nano-banana -- AI画像生成（チラシ・スライド特化）

nano-banana CLIを使い、チラシ・スライドに必要な画像素材をAI生成するためのガイド。

## 前提条件

- nano-banana CLIがインストール済み（`nano-banana --help` で確認）
- GEMINI_API_KEY が `~/.nano-banana/.env` に設定済み
- 透過背景を使う場合: FFmpeg + ImageMagick がインストール済み

未インストールの場合:
```bash
git clone https://github.com/kingbootoshi/nano-banana-2-skill.git ~/tools/nano-banana-2
cd ~/tools/nano-banana-2 && bun install && bun link
mkdir -p ~/.nano-banana && echo "GEMINI_API_KEY=your-key" > ~/.nano-banana/.env
# 透過背景用（任意）: brew install ffmpeg imagemagick
```

---

## ワークフロー上の位置づけ

chirashi-design / slide-design の **Step 3（写真・素材の確定）** で使用する。

ユーザーに写真の有無を確認し、以下のいずれかの場合にnano-bananaを提案する:

1. ユーザーが写真を持っていない
2. 写真の評価がB/Cで品質不足
3. 構成案に対して素材が不足している
4. イラスト・装飾的な素材が必要（写真では表現しにくいもの）
5. ブランド統一感のある素材セットが必要（スタイル転写）

**重要**: ユーザーに確認せずにAI画像を生成しない。「写真の代わりにAI生成画像を使いますか？」と必ず確認する。

---

## コマンドリファレンス

```bash
nano-banana "prompt" [options]
```

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `-o, --output` | 出力ファイル名（拡張子なし） | nano-gen-{timestamp} |
| `-s, --size` | 解像度: 512, 1K, 2K, 4K | 1K |
| `-a, --aspect` | アスペクト比: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 4:5, 5:4, 21:9 | モデルデフォルト |
| `-m, --model` | モデル: flash/nb2（高速）, pro/nb-pro（最高品質） | flash |
| `-d, --dir` | 出力ディレクトリ | カレント |
| `-r, --ref` | リファレンス画像（複数可） | なし |
| `-t, --transparent` | 透過背景で生成 | false |
| `--costs` | コスト集計を表示 | - |

---

## 印刷用解像度プリセット

### チラシ（A4: 210mm x 297mm, 350dpi）

| 用途 | ゾーン例 | 必要px（概算） | 推奨サイズ | モデル | コスト目安 |
|------|----------|---------------|-----------|--------|-----------|
| 全面背景 | ヒーロー全面 | ~2894x4134px | **4K** | pro | ~$0.302 |
| ヒーロー画像 | Hero 35-50% | ~2894x2067px | **2K-4K** | pro | $0.201-0.302 |
| 特徴セクション画像 | Features 15% | ~1447x620px | **1K-2K** | flash | $0.067-0.101 |
| アクセント・装飾 | バッジ・小画像 | ~500x500px | **512-1K** | flash | $0.045-0.067 |
| 透過素材 | カスタムイラスト | サイズ依存 | **1K-2K** | flash | $0.067-0.101 |

### スライド（1920x1080px）

| 用途 | スライドタイプ | 推奨サイズ | モデル | コスト目安 |
|------|-------------|-----------|--------|-----------|
| フルブリード背景 | Type 4 | **2K** | flash/pro | $0.101-0.201 |
| 半面画像 | Type 3（左右/上下分割） | **1K-2K** | flash | $0.067-0.101 |
| アイコン的ビジュアル | Type 5, 7 | **512-1K** | flash | $0.045-0.067 |
| 透過イラスト | 装飾・マスコット | **1K** | flash | $0.067 |

---

## アスペクト比の選び方

### チラシゾーン別

| ゾーン | 推奨比率 | 理由 |
|--------|---------|------|
| ヒーロー（横長帯） | **3:2** or **16:9** | A4幅に対して35-50%高さ → 横長 |
| ヒーロー（全面） | **3:4** or **4:5** | A4縦比率（210:297 ≈ 5:7）に近い |
| 左右分割の片側 | **4:5** or **3:4** | 縦長の半面に合う |
| 正方形ゾーン | **1:1** | 特徴ブロック、人物写真 |

### スライドゾーン別

| ゾーン | 推奨比率 | 理由 |
|--------|---------|------|
| フルブリード背景 | **16:9** | スライドと同じ比率 |
| 半面画像（左右分割） | **4:5** or **1:1** | 縦長要素として配置 |
| 上下分割の画像 | **16:9** or **21:9** | 横帯として配置 |

---

## 日本語デザイン向けプロンプト Tips

### 基本原則

1. **英語でプロンプトを書く** -- Geminiは英語プロンプトの方が品質が高い
2. **スタイル指定を明確に** -- "Japanese design style", "corporate", "minimal" など
3. **色を指定する** -- デザイン哲学で決めた配色をプロンプトに含める
4. **テキスト入りの画像は避ける** -- AIは日本語テキストを正確に描画できない。テキストはHTML側で重ねる
5. **object-fit: cover を意識する** -- トリミングされても重要部分が残る構図を指示する

### プロンプトテンプレート

**チラシ用ヒーロー画像:**
```bash
nano-banana "professional photograph of [被写体], [色調] color palette, \
high contrast, suitable for print flyer background, \
clean composition with space for text overlay on [位置]" \
-s 4K -a 3:2 -m pro -d output/[project]/ -o hero
```

**チラシ用イラスト（装飾）:**
```bash
nano-banana "minimal flat illustration of [テーマ], \
[メインカラー] and [アクセントカラー] color scheme, \
clean geometric style, no text" \
-s 1K -a 1:1 -d output/[project]/ -o feature-illust
```

**透過素材（アイコン的イラスト）:**
```bash
nano-banana "[被写体] icon illustration, flat design, simple, bold colors" \
-t -s 1K -d output/[project]/ -o icon-element
```

**スライド用フルブリード背景:**
```bash
nano-banana "abstract [テーマ] background, [ダーク/ライト] theme, \
subtle texture, [配色], corporate professional" \
-s 2K -a 16:9 -d output/[project]/ -o slide-bg
```

**スタイル統一（リファレンス画像使用）:**
```bash
nano-banana "similar style, [新しい被写体の説明]" \
-r output/[project]/hero.png -s 2K -d output/[project]/ -o feature-1
```

### NG例（避けるべきプロンプト）

- 日本語テキスト入り画像: "セミナー開催と書かれたバナー" --> テキストはHTML側で
- 曖昧な指示: "いい感じの画像" --> 具体的な被写体・色・スタイルを指定
- 過密な構図: "人がたくさんいる会議室の写真" --> object-fit:coverで潰れる

---

## 既存写真との併用

### スタイル転写でブランド統一

ユーザー提供の写真がある場合、それをリファレンスに使ってAI生成画像のトーンを合わせる:

```bash
nano-banana "similar lighting and color tone, [新しい被写体]" \
-r user-photo.jpg -s 2K -d output/[project]/ -o ai-supplement
```

### 評価フローへの組み込み

AI生成画像も Step 3.2 の S/A/B/C 評価を通す:

| 評価観点 | AI生成画像での判断基準 |
|---------|---------------------|
| 解像度 | 2K以上で生成していれば S/A |
| 構図・被写体 | プロンプト通りの内容か、不自然なアーティファクトがないか |
| 明るさ・色調 | デザイン哲学の配色と一致しているか |
| トリミング耐性 | object-fit: cover で切り抜いても被写体が残るか |
| **AI特有** | テキスト混入がないか、手指などの破綻がないか |

品質が不十分な場合: プロンプトを調整して再生成、またはモデルをproに変更。

---

## コスト管理

### 制作物別の見積もり例

| 制作物 | 画像数 | 構成 | 合計コスト目安 |
|-------|-------|------|-------------|
| チラシ片面（写真3枚） | 3 | Hero 4K pro + Feature 1K flash x2 | ~$0.44 |
| チラシ両面（写真5枚） | 5 | 4K pro x1 + 2K flash x2 + 1K flash x2 | ~$0.64 |
| スライド10枚（背景5枚） | 5 | 2K flash x5 | ~$0.51 |
| フルセット（チラシ+スライド） | 8 | 上記合計 | ~$0.94 |

### コスト最適化テクニック

1. **コンセプト確認は512/flashで** -- 方向性が決まるまでは低解像度で試す
2. **最終版のみ高解像度** -- 確定したプロンプトでのみ2K/4K/proを使う
3. **スタイル転写を活用** -- 1枚の高品質画像から他の画像のトーンを統一
4. **コスト確認**: `nano-banana --costs` で累計コストを確認

---

## 参照

- nano-banana CLI: `~/tools/nano-banana-2/`
- コスト履歴: `~/.nano-banana/costs.json`
- API キー設定: `~/.nano-banana/.env`
- API キー取得: https://aistudio.google.com/apikey
