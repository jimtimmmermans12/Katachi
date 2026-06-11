import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CookieBanner from "@/components/CookieBanner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://katachi-blond.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "KATACHI — Minimal Japanese Homeware",
  description:
    "Japanese-inspired minimalist homeware with calm editorial design and slow, intentional living.",
  openGraph: {
    siteName: "KATACHI",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "KATACHI — Minimal Japanese Homeware",
    description:
      "Japanese-inspired minimalist homeware with calm editorial design and slow, intentional living.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=1200&q=80",
        width: 1200,
        height: 800,
        alt: "KATACHI — Japanese ceramics for the intentional home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KATACHI — Minimal Japanese Homeware",
    description:
      "Japanese-inspired minimalist homeware with calm editorial design and slow, intentional living.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${notoSerifJp.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-shiro text-sumi font-body antialiased">
        <CartProvider>{children}</CartProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
