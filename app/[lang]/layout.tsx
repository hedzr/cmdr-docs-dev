import "../global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { AR_One_Sans, IBM_Plex_Mono } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { I18nProvider, Translations } from "fumadocs-ui/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "../provider";
import { lang2display, lang2iso } from "@/lib/i18n";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { prodMode } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
// import { baseUrl } from "@/lib/metadata";
// import getConfig from "next/config";

// -- https://www.npmjs.com/package/@next/font?activeTab=code
// -- and check out `/@next/font/ /dist/google/font-data.json`

// const inter = Inter({
//   subsets: ["latin"],
// });

const arOneSans = AR_One_Sans({
  variable: "--font-ar-one-sans",
  subsets: ["latin", "latin-ext"],
});

// const azeretMono = Azeret_Mono({
//   variable: "--font-azeret-mono",
//   subsets: ["latin", "latin-ext"],
// });

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// internationalization --------------------------------

const cn: Partial<Translations> = {
  search: "Search", // "Translated Content",
  // other translations
};

// Root Layout Here --------------------------------

function wrapMonitorOrNot(children: ReactNode): ReactNode {
  return prodMode ? (
    <Suspense fallback={null}>
      <PostHogProvider>{children}</PostHogProvider>
    </Suspense>
  ) : (
    children
  );
}

function wrapAnalyticsOrNot(): ReactNode {
  return prodMode ? (
    <Suspense fallback={null}>
      <SpeedInsights />
      <Analytics />
      <GoogleAnalytics gaId="G-301DLP27SS" />
    </Suspense>
  ) : (
    <></>
  );
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const lang = (await params).lang;

  // const { serverRuntimeConfig } = getConfig();
  // console.log(`--- [SiteLayout] cwd: ${process.cwd()}, __dirname: ${serverRuntimeConfig.PROJECT_ROOT}, lang: `, lang);

  return (
    <html
      lang={lang2iso[lang]}
      // base-url={baseUrl.toString()}
      // base-env={process.env.NODE_ENV}
      // base-vercel-env={process.env.NEXT_PUBLIC_VERCEL_ENV || "not-spec"}
      // base-next-site-url={process.env.NEXT_PUBLIC_SITE_URL || "not-spec"}
      // base-next-vercel-url={process.env.NEXT_PUBLIC_VERCEL_URL || "not-spec"}
      // base-vercel-url={process.env.VERCEL_URL || "not-spec"}
      className={arOneSans.className}
      suppressHydrationWarning
      // className={`want`}
    >
      <body
        className={`flex flex-col min-h-screen ${arOneSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <NextTopLoader />
        <I18nProvider
          locale={lang}
          locales={lang2display}
          translations={{ cn }[lang]}
        >
          {wrapMonitorOrNot(<RootProvider>{children}</RootProvider>)}
          {wrapAnalyticsOrNot()}
        </I18nProvider>
      </body>
    </html>
  );
}
