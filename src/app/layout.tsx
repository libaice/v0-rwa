import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RWA Oracle - Real World Assets Price Oracle",
  description: "Decentralized oracle system for real-world asset pricing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark`}>
        <Header />
        <main className="min-h-screen pt-20 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
