import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spently | Smart Expense Tracker",
  description: "Track your expenses smartly with voice input powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0c" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${outfit.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
