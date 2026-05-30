import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/utils/auth/AuthProvider"
import {
  JsonLd,
  organizationSchema,
  webSiteSchema,
} from "@/components/seo/JsonLd"
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SEO_KEYWORDS,
} from "@/lib/seo"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AgenticPilot — AI-Powered Business Automation Platform",
    template: "%s | AgenticPilot",
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "AgenticPilot Team", url: SITE_URL }],
  creator: "AgenticPilot",
  publisher: "AgenticPilot",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "AgenticPilot — AI-Powered Business Automation Platform",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "AgenticPilot — AI-Powered Business Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgenticPilot — AI-Powered Business Automation Platform",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    creator: "@agenticpilot",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://github.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <JsonLd data={organizationSchema(SITE_URL)} />
        <JsonLd data={webSiteSchema(SITE_URL)} />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
