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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "imhannsop — Portfolio",
  description:
    "CS student building neobrutalist web apps and customizing Linux systems. Focused on low-level control, neat terminal setups, and high-impact interfaces.",
  metadataBase: new URL(
    basePath
      ? `https://ekoubuyoi.github.io${basePath}`
      : "https://ekoubuyoi.github.io"
  ),
  openGraph: {
    title: "imhannsop — Portfolio",
    description:
      "CS student building neobrutalist web apps and customizing Linux systems.",
    url: "/",
    siteName: "imhannsop",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "imhannsop portfolio preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "imhannsop — Portfolio",
    description:
      "CS student building neobrutalist web apps and customizing Linux systems.",
    images: ["/opengraph-image.png"],
  },
  icons: { icon: "/favicon.ico" },
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