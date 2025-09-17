import * as React from "react";
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import i18nConfig from '@/i18nConfig';
import "@/app/components/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Cloud MPS",
    default: "Cloud MPS",
  },
  description: "Cloud MPS",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
