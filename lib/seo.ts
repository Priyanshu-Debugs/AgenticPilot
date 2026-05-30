import type { Metadata } from "next";

// ─── Site-wide SEO constants ────────────────────────────────────────────────
export const SITE_URL = "https://www.agenticpilot.app";
export const SITE_NAME = "AgenticPilot";
export const SITE_DESCRIPTION =
  "Automate your business with AI-powered agents. AgenticPilot handles Gmail replies, X/Twitter posts, LinkedIn outreach, and Instagram content — all from one intelligent dashboard.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SEO_KEYWORDS = [
  "AgenticPilot",
  "AI automation",
  "AI business automation",
  "AI-powered automation platform",
  "Gmail AI auto reply",
  "social media automation",
  "LinkedIn automation tool",
  "Twitter automation",
  "Instagram AI automation",
  "business workflow automation",
  "AI agents for business",
  "agentic AI platform",
  "automated customer support",
  "AI content scheduling",
  "SaaS automation tool",
];

// ─── Helper: build a complete Metadata object for any page ──────────────────
export function createPageMetadata({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: SEO_KEYWORDS,
    authors: [{ name: "AgenticPilot Team", url: SITE_URL }],
    creator: "AgenticPilot",
    publisher: "AgenticPilot",
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@agenticpilot",
    },
  };
}
