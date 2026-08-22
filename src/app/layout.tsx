import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jbmono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "imhannsop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-bg">
      <body
        className={`${jetbrainsMono.variable} ${fraunces.variable} flex flex-col items-center bg-bg font-mono text-base text-text`}
      >
        {children}
      </body>
    </html>
  );
}