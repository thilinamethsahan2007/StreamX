import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import PreloaderWrapper from "@/components/PreloaderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamX",
  description: "Unlimited movies, TV shows, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </Providers>
      </body>
    </html>
  );
}
