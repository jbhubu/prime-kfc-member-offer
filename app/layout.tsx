import type { Metadata } from "next";
import "./globals.css";

const localeMap: Record<string, string> = {
  UK: "en-GB", US: "en-US", DE: "de-DE", CA: "en-CA", JP: "ja-JP", ES: "es-ES", IT: "it-IT",
};

export const metadata: Metadata = {
  title: "Prime × KFC member offer",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = localeMap[process.env.ACTIVE_COUNTRY || "US"] || "en-US";
  return <html lang={lang}><body>{children}</body></html>;
}
