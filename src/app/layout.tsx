import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThunderBackground from "@/components/ThunderBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://denki-isu-game-neo.vercel.app";
const siteName = "電気イスゲーム";
const siteDescription =
  "1台の端末で2人対戦！12脚のイスに電流を仕掛け合う心理戦ゲーム。40点先取で勝利、3回感電したら負け！友達や家族と一緒に楽しめる無料ブラウザゲームです。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - 2人対戦心理戦ゲーム`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "電気イスゲーム",
    "対戦ゲーム",
    "2人対戦",
    "心理戦",
    "ブラウザゲーム",
    "無料ゲーム",
    "パーティーゲーム",
    "ローカル対戦",
    "イス取りゲーム",
    "電流ゲーム",
  ],
  authors: [{ name: "yoshimple", url: "https://note.com/yoshimple" }],
  creator: "yoshimple",
  publisher: "yoshimple",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - 2人対戦心理戦ゲーム`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "電気イスゲーム - 2人対戦心理戦ゲーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - 2人対戦心理戦ゲーム`,
    description: siteDescription,
    images: ["/og-image.png"],
    creator: "@yoshimple",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "game",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThunderBackground />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
