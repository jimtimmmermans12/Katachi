import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

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

export const metadata: Metadata = {
  title: "KATACHI — Minimal Japanese Homeware",
  description:
    "Japanese-inspired minimalist homeware with calm editorial design and slow, intentional living.",
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
      </body>
    </html>
  );
}
