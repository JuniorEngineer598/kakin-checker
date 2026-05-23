import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kakin-checker-raxi.vercel.app'),
  title: '課金チェッカー',
  description: 'ソシャゲ課金やサブスクをシンプルに管理するアプリ',
  icons: {
    icon: '/kakin_checker_icon.png',
  },
  openGraph: {
    title: '課金チェッカー',
    description: 'ソシャゲ課金やサブスクをシンプルに管理するアプリ',
    url: '/',
    siteName: '課金チェッカー',
    images: [
      {
        url: '/kakin_checker_icon.png',
        width: 512,
        height: 512,
        alt: '課金チェッカー',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '課金チェッカー',
    description: 'ソシャゲ課金やサブスクをシンプルに管理するアプリ',
    images: ['/kakin_checker_icon.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

