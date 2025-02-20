import "../global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { I18nProvider, Translations } from "fumadocs-ui/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
});

// internationalization --------------------------------

const cn: Partial<Translations> = {
  search: "Search", // "Translated Content",
  // other translations
};

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const lang = (await params).lang;
  return (
    <html lang="{lang}" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <I18nProvider
          locale={(await params).lang}
          locales={[
            { locale: "en", name: "English" },
            { locale: "cn", name: "Chinese" },
            { locale: "tw", name: "Chinese TW" },
          ]}
          translations={{ cn }[lang]}
        >
          <RootProvider>{children}</RootProvider>
        </I18nProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
