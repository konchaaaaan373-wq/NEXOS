import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: {
    default: "NEXOS — 医療機関のための採用ブランドOS",
    template: "%s | NEXOS",
  },
  description:
    "各クリニックが自院ブランドで採用できる状態を実装する、医療機関向け採用プラットフォーム",
  metadataBase: new URL("https://nexos.necofindjob.com"),
  openGraph: {
    title: "NEXOS — 医療機関のための採用ブランドOS",
    description:
      "各クリニックが自院ブランドで採用できる状態を実装する、医療機関向け採用プラットフォーム。自院ブランドで、採用を変える。",
    url: "https://nexos.necofindjob.com",
    siteName: "NEXOS",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXOS — 医療機関のための採用ブランドOS",
    description:
      "各クリニックが自院ブランドで採用できる状態を実装する、医療機関向け採用プラットフォーム",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
