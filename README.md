# flyer-design-skill

日本語チラシ・プレゼンスライドのデザインから印刷用PDF出力までを一貫して行う [Claude Code](https://claude.ai/claude-code) スキル集。

## 含まれるスキル

| スキル | 説明 | 起動コマンド |
|---|---|---|
| **chirashi-design** | チラシ（フライヤー）のデザイン・作成・PDF出力 | `/chirashi-design` |
| **slide-design** | プレゼンスライドのデザイン・作成・PDF出力 | `/slide-design` |
| **agent-team** | 並列マルチエージェント運用ガイド | `/agent-team` |

## インストール

### 方法1: パーソナルスキル（全プロジェクトで使用可能）

```bash
git clone https://github.com/kaneoka0417/flyer-design-skill.git ~/.claude/skills/flyer-design
```

### 方法2: プロジェクトスキル（特定プロジェクトのみ）

```bash
git clone https://github.com/kaneoka0417/flyer-design-skill.git .claude/skills/flyer-design
```

### PDF生成の依存関係

```bash
cd ~/.claude/skills/flyer-design  # または .claude/skills/flyer-design
npm install                        # Puppeteer（Chromium自動ダウンロード）+ Reveal.js
brew install ghostscript           # macOS
# sudo apt install ghostscript     # Linux
```

## 使い方

### チラシ作成

Claude Codeで「チラシを作りたい」と伝えるだけで自動的にスキルが起動します。

**ワークフロー:**

1. **要件ヒアリング** — 目的、ターゲット、サイズ、片面/両面、ダーク/ライト、掲載情報を徹底確認
2. **パターン選択** — 条件に応じたテンプレートを自動選択
3. **デザイン哲学の策定** — トーン&マナー、配色、タイポグラフィの方向性を言語化
4. **構成案の作成** — コピー、ゾーン配分%、数字強調サイズ、画像要件を設計
5. **写真・素材の確定** — ユーザーの手持ち写真を評価・選定、不足分を指摘
6. **HTML/CSSでデザイン** — パターンテンプレートをベースにカスタマイズ
7. **レイアウト検証** — スペース予算計算、1ページ収まり保証、写真品質チェック
8. **PDF生成** — Puppeteer（2x解像度）+ Ghostscript（/prepress, 600dpi）で高画質PDF出力

### スライド作成

「スライドを作りたい」と伝えると起動します。

**ワークフロー:**

1. **要件ヒアリング** — 目的、ターゲット、持ち時間、テーマ、使用環境を確認
2. **テンプレート選択** — ダーク/ライトテーマを選択
3. **デザイン哲学の策定** — ビジュアルトーン、配色、タイポグラフィを言語化
4. **構成案作成（スライドマップ）** — 各スライドのタイプ・メッセージ・ビジュアル要件を設計
5. **写真・素材の確定** — 候補の評価・選定
6. **Reveal.js + HTML/CSS実装** — テーマテンプレートをベースにカスタマイズ
7. **プレビュー検証** — 1スライド1メッセージ、フォントサイズ、余白チェック
8. **PDF生成** — Reveal.js print-pdf + Ghostscript で高画質PDF出力

### PDF出力コマンド

```bash
# チラシ（A4）
node scripts/html_to_pdf.js output/my-flyer/flyer.html output/my-flyer/flyer.pdf

# チラシ（塗り足し付き）
node scripts/html_to_pdf.js output/my-flyer/flyer.html output/my-flyer/flyer.pdf --size A4-bleed

# スライド（16:9）
node scripts/slides_to_pdf.js presentation.html output.pdf

# スライド（4:3）
node scripts/slides_to_pdf.js presentation.html output.pdf --size 4:3
```

## ファイル構成

```
skills/
  ├── chirashi-design/SKILL.md          # チラシデザインスキル定義
  ├── slide-design/SKILL.md             # スライドデザインスキル定義
  └── agent-team/SKILL.md               # Agent Team運用スキル定義
references/
  ├── chirashi-design-system.md         # CORE: チラシデザインの全ルール（必読）
  ├── slide-design-system.md            # CORE: スライドデザインの全ルール（必読）
  ├── design-principles.md              # レイアウト・視線誘導・CTA原則
  ├── color-guide.md                    # 配色ガイド・日本の季節感・業種別カラー
  ├── typography.md                     # 日本語タイポグラフィ・Inter font
  ├── icons-images.md                   # SVGアイコン集（絵文字禁止）・画像ソース
  └── print-compatibility.md            # 印刷互換性・Ghostscript設定
assets/
  ├── templates/                        # チラシテンプレート（ダーク/ライト × 片面/両面）
  │   ├── pattern-dark-single.html
  │   ├── pattern-light-single.html
  │   ├── pattern-dark-double-front.html
  │   ├── pattern-dark-double-back.html
  │   ├── pattern-light-double-front.html
  │   └── pattern-light-double-back.html
  └── slide-templates/                  # スライドテーマ（ダーク/ライト）
      ├── theme-dark.html
      └── theme-light.html
scripts/
  ├── html_to_pdf.js                    # チラシPDF生成（Puppeteer + Ghostscript）
  ├── html_to_pdf.py                    # Python版チラシPDF生成
  └── slides_to_pdf.js                  # スライドPDF生成（Reveal.js + Ghostscript）
```

## 必要環境

- [Claude Code](https://claude.ai/claude-code)
- Node.js 18+
- Ghostscript（印刷互換PDF出力に必須）

## ライセンス

MIT
