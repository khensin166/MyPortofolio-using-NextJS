import NextTopLoader from "nextjs-toploader";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

import Layouts from "@/common/components/layouts";
import ThemeProviderContext from "@/common/stores/theme";
import { METADATA } from "@/common/constants/metadata";
import { inter } from "@/common/styles/fonts";
import SkeletonThemeProvider from "@/SkeletonThemeProvider";
import { routing } from "@/i18n/routing";
import VisitorTracker from "@/common/components/elements/VisitorTracker";
import { PostHogProvider } from "@/app/providers/PostHogProvider";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.DOMAIN || 
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://staging.kenantomfie.site"),
  ),
  description: METADATA.description,
  keywords: METADATA.keyword,
  creator: METADATA.creator,
  authors: {
    name: METADATA.creator,
    url: METADATA.openGraph.url,
  },
  openGraph: {
    images: [
      {
        url: METADATA.openGraph.image,
        width: 1200,
        height: 630,
        alt: METADATA.creator,
      },
    ],
    url: METADATA.openGraph.url,
    siteName: METADATA.openGraph.siteName,
    locale: METADATA.openGraph.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [METADATA.openGraph.image],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({
  children,
  params,
}: RootLayoutProps) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={inter.className}>
        <PostHogProvider>
          <NextTopLoader
            color="#fbe400"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #fbe400,0 0 5px #ffffb8"
          />
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProviderContext>
              <SkeletonThemeProvider>
                <Layouts>{children}</Layouts>
              </SkeletonThemeProvider>
            </ThemeProviderContext>
          </NextIntlClientProvider>
          <VisitorTracker />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
};

export default RootLayout;
