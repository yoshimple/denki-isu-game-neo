import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "電気イスゲーム - 2人対戦心理戦ゲーム";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        backgroundImage:
          "radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)",
      }}
    >
      {/* 雷エフェクト（装飾） */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 150,
          fontSize: 80,
          display: "flex",
        }}
      >
        ⚡
      </div>
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 150,
          fontSize: 80,
          display: "flex",
        }}
      >
        ⚡
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 200,
          fontSize: 60,
          display: "flex",
        }}
      >
        ⚡
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: 200,
          fontSize: 60,
          display: "flex",
        }}
      >
        ⚡
      </div>

      {/* メインタイトル */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 100, color: "#facc15" }}>⚡</span>
        <span
          style={{
            fontSize: 100,
            fontWeight: "bold",
            color: "#ffffff",
            textShadow: "0 0 40px rgba(250, 204, 21, 0.6)",
          }}
        >
          電気イスゲーム
        </span>
        <span style={{ fontSize: 100, color: "#facc15" }}>⚡</span>
      </div>

      {/* サブタイトル */}
      <div
        style={{
          fontSize: 40,
          color: "#9ca3af",
          marginBottom: 40,
          display: "flex",
        }}
      >
        12脚のイスに電流を仕掛け合う心理戦
      </div>

      {/* 特徴 */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginTop: 20,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            padding: "16px 32px",
            borderRadius: 12,
            border: "2px solid #3b82f6",
            color: "#60a5fa",
            fontSize: 28,
            display: "flex",
          }}
        >
          🎮 2人対戦
        </div>
        <div
          style={{
            backgroundColor: "rgba(250, 204, 21, 0.2)",
            padding: "16px 32px",
            borderRadius: 12,
            border: "2px solid #facc15",
            color: "#fcd34d",
            fontSize: 28,
            display: "flex",
          }}
        >
          🧠 心理戦
        </div>
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            padding: "16px 32px",
            borderRadius: 12,
            border: "2px solid #ef4444",
            color: "#f87171",
            fontSize: 28,
            display: "flex",
          }}
        >
          💥 感電回避
        </div>
      </div>

      {/* フッター */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          fontSize: 24,
          color: "#6b7280",
          display: "flex",
        }}
      >
        Created by @yoshimple
      </div>
    </div>,
    {
      ...size,
    },
  );
}
