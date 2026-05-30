interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD structured data script tag.
 * Use in server components to inject schema.org data for rich results.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Pre-built schema generators ────────────────────────────────────────────

export function organizationSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AgenticPilot",
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    description:
      "AI-powered business automation platform for Gmail, X/Twitter, LinkedIn, and Instagram.",
    email: "agenticpilot.team@gmail.com",
    foundingDate: "2025",
    founders: [
      { "@type": "Person", name: "Priyaanshu Patel" },
      { "@type": "Person", name: "Mihir Patel" },
      { "@type": "Person", name: "Sujal Patel" },
      { "@type": "Person", name: "Vashishtha Patel" },
    ],
    sameAs: [
      "https://github.com/Priyanshu-Debugs/AgenticPilot",
    ],
  };
}

export function webSiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgenticPilot",
    url: siteUrl,
    description:
      "Automate your business with AI-powered agents. Gmail replies, social media management, and content scheduling.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AgenticPilot",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered business automation platform that handles Gmail replies, social media management, and content workflows.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "1999",
      highPrice: "12999",
      priceCurrency: "INR",
      offerCount: 3,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function faqSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
