import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameTime — App Store screenshots",
  description: "Marketing screenshot generator for Mirthbound GameTime (iPhone). Copy aligned with internal GAMETIME.md allowed claims.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`min-h-full ${dmSans.className}`}>{children}</body>
    </html>
  );
}
