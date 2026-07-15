import type { Metadata } from "next";
import { Tajawal, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChromeExtras from "@/components/ChromeExtras";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "أسعار — قارن سعر جوالك عبر كل المتاجر",
  description:
    "منصة حيّة لمقارنة أسعار الجوالات عبر المتاجر، والحجز المسبق بالدفع عند الحضور.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${plexArabic.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChromeExtras />
      </body>
    </html>
  );
}
