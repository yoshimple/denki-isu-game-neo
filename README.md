# ⚡ 電気イスゲーム ⚡

2 人対戦型の心理戦ゲームです。12 脚のイスに電流を仕掛け合い、相手を感電させながらポイントを稼ぎましょう！

## 🎮 ゲームルール

### 基本ルール

- **12 脚のイス**から 1 つを選んで座ります
- 相手が**電気イス**を仕掛けています
- 感電せずに座れたら**イス番号分のポイント**を獲得
- **40 点先取**で勝利！
- **3 回感電**したら負け

### ゲームの流れ

1. **スイッチ側**：相手が座ったら感電する「電気イス」を 1 脚選んで設定
2. **着席側**：12 脚のイスから 1 つを選んで座る
3. **判定**：電気イスに座ってしまったら感電！安全なイスならポイント獲得
4. 攻守交代して繰り返し

### 勝利条件

- 40 点以上獲得
- 相手が 3 回感電

### 終了条件

- どちらかが勝利条件を満たす
- イスが残り 1 脚になった場合（得点 → 感電回数で勝敗決定）

## 🛠️ 技術スタック

- **Framework**: [Next.js](https://nextjs.org) 16
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS 4
- **Linter/Formatter**: [Biome](https://biomejs.dev)

## 📁 プロジェクト構成

```text
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # スタート画面（プレイヤー名入力）
│   ├── game/page.tsx      # ゲームプレイ画面
│   └── vs/page.tsx        # 対戦画面
├── components/            # UIコンポーネント
│   ├── Chair.tsx          # イスコンポーネント
│   ├── Stage.tsx          # ステージ（12脚のイス配置）
│   ├── ScoreBoard.tsx     # スコア表示
│   ├── ControlPanel.tsx   # 操作パネル
│   └── ...
├── core/                  # ゲームロジック
│   ├── gameTypes.ts       # 型定義
│   └── gameEngine.ts      # ゲームエンジン（状態管理）
└── hooks/
    └── useGameState.ts    # ゲーム状態管理フック
```

## 🚀 開発環境のセットアップ

### 必要要件

- Node.js 18 以上

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが起動します。

### その他のコマンド

```bash
# ビルド
npm run build

# 本番モードで起動
npm run start

# Lint チェック
npm run lint

# コードフォーマット
npm run format
```

## 🎯 今後の拡張予定

- オンライン対戦機能（WebSocket 対応）
- AI 対戦モード
- 効果音・BGM 追加
- モバイル最適化

## 📝 ライセンス

MIT
