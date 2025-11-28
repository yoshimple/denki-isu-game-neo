"use client";

import { useCallback, useEffect, useState } from "react";

interface Lightning {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

export default function ThunderBackground() {
  const [lightnings, setLightnings] = useState<Lightning[]>([]);

  const createLightning = useCallback(() => {
    const id = Date.now() + Math.random();
    const lightning: Lightning = {
      id,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: 100 + Math.random() * 200,
      opacity: 0.3 + Math.random() * 0.5,
      delay: Math.random() * 0.3,
    };

    setLightnings((prev) => [...prev, lightning]);

    // 雷を削除
    setTimeout(() => {
      setLightnings((prev) => prev.filter((l) => l.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    // ランダムな間隔で雷を発生
    const triggerLightning = () => {
      createLightning();
      // 次の雷までの間隔をランダムに設定（1.5秒〜4秒）
      const nextInterval = 1500 + Math.random() * 2500;
      setTimeout(triggerLightning, nextInterval);
    };

    // 初回の雷
    const initialDelay = setTimeout(triggerLightning, 1000);

    return () => clearTimeout(initialDelay);
  }, [createLightning]);

  return (
    <div className="thunder-background">
      {/* 雲のレイヤー */}
      <div className="clouds-layer">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />
      </div>

      {/* 雷光エフェクト */}
      {lightnings.map((lightning) => (
        <div
          key={lightning.id}
          className="lightning-flash"
          style={{
            left: `${lightning.x}%`,
            top: `${lightning.y}%`,
            width: `${lightning.size}px`,
            height: `${lightning.size}px`,
            opacity: lightning.opacity,
            animationDelay: `${lightning.delay}s`,
          }}
        />
      ))}

      {/* 画面全体のフラッシュ効果 */}
      {lightnings.length > 0 && <div className="screen-flash" />}
    </div>
  );
}
