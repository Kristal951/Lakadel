import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSwitcherWrapper from "@/components/ThemeSwitcherWrapper";
import Header from "@/components/shop/Header";
import TopBar from "@/components/shop/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lakadel ",
  description: "Shop Lakadel, shop elegance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (stored === "dark" || (!stored && systemDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (_) {}
})();
`,
          }}
        />
        <link rel="icon" href="/Lakadel.svg" type="image/svg+xml" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link rel="shortcut icon" href="/favicon.ico" />

        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased block`}
      >
        <ThemeProvider>
           <Header />
           <TopBar />
          {children}
          <ThemeSwitcherWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
