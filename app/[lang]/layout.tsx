import "../global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { I18nProvider, Translations } from "fumadocs-ui/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "../provider";
import { lang2iso } from "@/lib/i18n";
import { baseUrl } from "@/lib/metadata";
import { GoogleAnalytics } from '@next/third-parties/google'

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
    <html
      lang={lang2iso[lang]}
      base-url={baseUrl.toString()}
      base-env={process.env.NODE_ENV}
      base-vercel-env={process.env.NEXT_PUBLIC_VERCEL_ENV || "not-spec"}
      base-next-site-url={process.env.NEXT_PUBLIC_SITE_URL || "not-spec"}
      base-next-vercel-url={process.env.NEXT_PUBLIC_VERCEL_URL || "not-spec"}
      base-vercel-url={process.env.VERCEL_URL || "not-spec"}
      className={inter.className}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <I18nProvider
          locale={(await params).lang}
          locales={[
            { locale: "en", name: "English" },
            { locale: "cn", name: "Simplified Chinese" },
            { locale: "tw", name: "Traditional Chinese" },
          ]}
          translations={{ cn }[lang]}
        >
          <PostHogProvider>
            <RootProvider>{children}</RootProvider>
          </PostHogProvider>
        </I18nProvider>
        <SpeedInsights />
        <GoogleAnalytics gaId="G-301DLP27SS" />
      </body>
    </html>
  );
}
