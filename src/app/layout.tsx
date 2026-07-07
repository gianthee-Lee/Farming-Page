import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { prisma } from '@/lib/prisma';

export async function generateMetadata() {
  const siteInfo = await prisma.siteInfo.findUnique({ where: { id: 1 } });
  return {
    title: siteInfo?.farmName || "프리미엄 쉼터",
    description: siteInfo?.cabinIntro || "온전한 쉼을 위한 공간입니다.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
