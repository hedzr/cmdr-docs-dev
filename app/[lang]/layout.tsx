import { RootProvider } from "fumadocs-ui/provider/next";
import "../global.css";
import { Inter, AR_One_Sans, IBM_Plex_Mono } from "next/font/google";

import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n, lang2iso, translations } from "@/lib/i18n";
// import { I18nProvider } from "fumadocs-ui/contexts/i18n";
import { VercelToolbar } from "@vercel/toolbar/next";
import { previewMode, prodMode } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
import { ReactNode, Suspense } from "react";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "../provider";

import "katex/dist/katex.css";

import {
  Home,
  Search,
  HandHelping,
  MonitorCog,
  MessageCircleQuestionMark,
} from "lucide-react";
import { baseUrl } from "@/lib/repo";

const { provider } = defineI18nUI(i18n, {
  translations: translations,
});

// -- https://www.npmjs.com/package/@next/font?activeTab=code
// -- and check out `/@next/font/ /dist/google/font-data.json`

const inter = Inter({
  subsets: ["latin"],
});

const arOneSans = AR_One_Sans({
  variable: "--font-ar-one-sans",
  subsets: ["latin", "latin-ext"],
});

// // const azeretMono = Azeret_Mono({
// //   variable: "--font-azeret-mono",
// //   subsets: ["latin", "latin-ext"],
// // });

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

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
      {/* Cloudflare Web Analytics */}
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "7681cbee52cc43e39060f9e3fda7a815"}'
      ></script>
    </Suspense>
  ) : (
    <></>
  );
}

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  // const { serverRuntimeConfig } = await getConfig();
  // console.log(`--- [SiteLayout] cwd: ${process.cwd()}, __dirname: ${serverRuntimeConfig.PROJECT_ROOT}, lang: ${lang}`);

  if (!prodMode)
    console.log(
      `--- [SiteLayout] cwd: ${process.cwd()}, baseUrl: ${baseUrl}, lang: ${lang}, prod-env: ${process.env.NODE_ENV}, shouldInjectToolbar: ${shouldInjectToolbar}`,
    );

  return (
    <html
      lang={lang2iso[lang]}
      // className={inter.className}
      className={arOneSans.className}
      // base-url={baseUrl.toString()}
      // base-env={process.env.NODE_ENV}
      // base-vercel-env={process.env.NEXT_PUBLIC_VERCEL_ENV || "not-spec"}
      // base-next-site-url={process.env.NEXT_PUBLIC_SITE_URL || "not-spec"}
      // base-next-vercel-url={process.env.NEXT_PUBLIC_VERCEL_URL || "not-spec"}
      // base-vercel-url={process.env.VERCEL_URL || "not-spec"}
      suppressHydrationWarning
    >
      <body
        // className="flex flex-col min-h-screen" // ${arOneSans.variable} ${ibmPlexMono.variable} antialiased
        className={`flex flex-col min-h-screen ${arOneSans.variable} ${ibmPlexMono.variable} antialiased`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <NextTopLoader />
        {wrapMonitorOrNot(
          <RootProvider i18n={provider(lang)}>
            {children}

            {/* https://vercel.com/kb/guide/use-feature-flags-in-fumadocs-with-the-vercel-toolbar */}
            {shouldInjectToolbar && <VercelToolbar />}
          </RootProvider>,
        )}
        {wrapAnalyticsOrNot()}
      </body>
    </html>
  );
}

// export default function Layout({ children }: LayoutProps<'/'>) {
//   return (
//     <html lang="en" className={inter.className} suppressHydrationWarning>
//       <body className="flex flex-col min-h-screen">
//         <RootProvider>{children}</RootProvider>
//       </body>
//     </html>
//   );
// }
