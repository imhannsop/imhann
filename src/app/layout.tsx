import type { Metadata } from "next";
import { Cause, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const cause = Cause({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cause",
});

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

import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-bg" suppressHydrationWarning>
      <head>
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            try {
              if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body
        className={`${cause.variable} ${jetbrainsMono.variable} ${fraunces.variable} flex flex-col items-center bg-bg text-base text-text`}
      >
        {children}
      </body>
    </html>
  );
}