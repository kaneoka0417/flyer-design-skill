# flyer-design-skill

日本語チラシのデザインから印刷用PDF出力までを一貫して行う [Claude Code](https://claude.ai/claude-code) スキル。

デザイン哲学の策定 → 構成案 → 写真選定 → HTML/CSS実装 → レイアウト検証 → PDF出力 のワークフローを提供します。

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
npm install                        # Puppeteer（Chromium自動ダウンロード）
brew install ghostscript           # macOS
# sudo apt install ghostscript     # Linux
```

## 使い方

Claude Codeで `/flyer-design` と入力するか、「チラシを作りたい」と伝えるだけで自動的にスキルが起動します。

### ワークフロー

1. **要件ヒアリング** — 目的、ターゲット、サイズ、掲載情報を確認
2. **デザイン哲学の策定** — トーン&マナー、配色、タイポグラフィの方向性を言語化
3. **構成案の作成** — コピー、レイアウト、画像要件を設計
4. **写真・素材の確定** — ユーザーの手持ち写真を評価・選定、不足分を指摘
5. **HTML/CSSでデザイン** — A4固定サイズでチラシらしい高密度レイアウトを実装
6. **レイアウト検証** — スペース予算計算、1ページ収まり保証、写真品質チェック
7. **PDF生成** — Puppeteer + Ghostscriptで印刷互換性の高いPDFを出力

### 出力例

```bash
# 基本（A4）
node scripts/html_to_pdf.js output/my-flyer/flyer.html output/my-flyer/flyer.pdf

# 塗り足し付き
node scripts/html_to_pdf.js output/my-flyer/flyer.html output/my-flyer/flyer.pdf --size A4-bleed
```

## 含まれるもの

```
SKILL.md                          # メインスキル定義
references/
  ├── design-principles.md        # レイアウト・配色・タイポグラフィ原則
  ├── color-guide.md              # 配色ガイド・日本の季節感
  ├── typography.md               # 日本語タイポグラフィ
  ├── flyer-vs-web.md             # チラシとWebの違い（重要）
  ├── icons-images.md             # アイコン・イラスト・画像リソース
  └── print-compatibility.md      # 印刷互換性・Ghostscript設定
assets/templates/
  ├── basic-a4.html               # 基本A4テンプレート
  ├── event-a4.html               # イベント用テンプレート
  └── seminar-a4.html             # セミナー用テンプレート
scripts/
  ├── html_to_pdf.js              # PDF生成スクリプト（Puppeteer + Ghostscript）
  └── html_to_pdf.py              # Python版PDF生成
```

## 必要環境

- [Claude Code](https://claude.ai/claude-code)
- Node.js 18+
- Ghostscript（印刷互換PDF出力に必須）

## ライセンス

MIT
