import "@/app/global.css";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider, Translations } from "fumadocs-ui/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "@/app/provider";
import { lang2iso } from "@/lib/i18n";
import { baseUrl } from "@/lib/metadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

import Footer from "@/components/layout/footer";

// import { Inter } from "next/font/google";
// const inter = Inter({
//     subsets: ["latin"],
// });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// internationalization --------------------------------

const cn: Partial<Translations> = {
  search: "Search", // "Translated Content",
  // other translations
};

export default function BlogStdLayout({
  //   params,
  children,
}: {
  //   params: Promise<{ lang: string; slugs: string[] }>;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center pt-8 pb-10 md:w-[87%] mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
      <Footer />
    </div>
  );
}

// async function BlogLayout({
//   params,
//   children,
// }: {
//   params: Promise<{ lang: string; slugs: string[] }>;
//   children: ReactNode;
// }) {
//   const lang = (await params).lang;
//   return (
//     <html
//       lang={lang2iso[lang]}
//       // base-url={baseUrl.toString()}
//       // base-env={process.env.NODE_ENV}
//       // base-vercel-env={process.env.NEXT_PUBLIC_VERCEL_ENV || "not-spec"}
//       // base-next-site-url={process.env.NEXT_PUBLIC_SITE_URL || "not-spec"}
//       // base-next-vercel-url={process.env.NEXT_PUBLIC_VERCEL_URL || "not-spec"}
//       // base-vercel-url={process.env.VERCEL_URL || "not-spec"}
//       className={geistSans.className}
//       suppressHydrationWarning
//     >
//       <body className="flex flex-col min-h-screen">
//         <I18nProvider
//           locale={(await params).lang}
//           locales={[
//             { locale: "en", name: "English" },
//             { locale: "cn", name: "Simplified Chinese" },
//             { locale: "tw", name: "Traditional Chinese" },
//           ]}
//           translations={{ cn }[lang]}
//         >
//           {/*<PostHogProvider>*/}
//           <RootProvider>
//             <div
//               className={`flex flex-col items-start justify-center pt-8 pb-10 md:w-[87%] mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
//             >
//               {children}
//             </div>
//           </RootProvider>
//           {/*</PostHogProvider>*/}
//         </I18nProvider>
//         {/*<SpeedInsights />*/}
//         {/*<GoogleAnalytics gaId="G-301DLP27SS" />*/}
//         {/*<Analytics />*/}
//       </body>
//     </html>
//   );
// }
