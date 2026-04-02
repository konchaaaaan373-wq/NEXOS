import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1",
};

export const metadata: Metadata = {
  title: {
    default: "NEXOS - AI搭載の医療機関向け採用OS",
    template: "%s | NEXOS",
  },
  description:
    "AIエージェントが採用を自動化。各医療機関が自院ブランドで採用ページを持ち、求人公開から選考管理まで一気通貫で行える次世代採用プラットフォーム。",
  metadataBase: new URL("https://nexos.necofindjob.com"),
  openGraph: {
    title: "NEXOS - AI搭載の医療機関向け採用OS",
    description:
      "AIエージェントが採用を自動化。各医療機関が自院ブランドで採用ページを持ち、求人公開から選考管理まで一気通貫で行える次世代採用プラットフォーム。",
    url: "https://nexos.necofindjob.com",
    siteName: "NEXOS",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXOS - AI搭載の医療機関向け採用OS",
    description:
      "AIエージェントが採用を自動化。医療機関向け次世代採用プラットフォーム。",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
