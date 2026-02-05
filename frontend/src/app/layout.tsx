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

export const metadata: Metadata = {
  title: "Molt Protocol",
  description: "Your vote, your protocol. Community-driven DeFi.",
  openGraph: {
    title: "Molt Protocol",
    description: "Your vote, your protocol. Community-driven DeFi.",
    type: "website",
    siteName: "Molt Protocol",
  },
  twitter: {
    card: "summary",
    title: "Molt Protocol",
    description: "Your vote, your protocol. Community-driven DeFi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
