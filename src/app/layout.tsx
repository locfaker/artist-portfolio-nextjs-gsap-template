import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web3d-eosin-alpha.vercel.app";
const siteDescription =
  "Interactive artist portfolio with press globe, media coverage slider, and filmography showcase.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Becky Entertainment | Artist Portfolio",
    template: "%s | Becky Entertainment",
  },
  description: siteDescription,
  applicationName: "Becky Entertainment",
  authors: [{ name: "Becky Entertainment" }],
  creator: "Becky Entertainment",
  publisher: "Becky Entertainment",
  category: "entertainment",
  keywords: [
    "Becky Entertainment",
    "Becky Armstrong",
    "artist portfolio",
    "filmography",
    "press and media",
    "interactive web",
    "#BeckyEntertainment",
    "#BeckyArmstrong",
    "#Filmography",
    "#PressMedia",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Becky Entertainment | Artist Portfolio",
    description: siteDescription,
    siteName: "Becky Entertainment",
    locale: "en_US",
    images: [
      {
        url: "/assets/images/becky_hero.webp",
        width: 1200,
        height: 630,
        alt: "Becky Entertainment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Becky Entertainment | Artist Portfolio",
    description: siteDescription,
    images: ["/assets/images/becky_hero.webp"],
  },
  other: {
    hashtags: "#BeckyEntertainment,#BeckyArmstrong,#ArtistPortfolio,#Filmography,#PressMedia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans text-white relative">
        <SmoothScroll>
          <Header />
          <PageTransition>
            {children}
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
