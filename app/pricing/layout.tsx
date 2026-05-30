import type { Metadata } from "next";
import { createPageMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing — AgenticPilot AI Automation Plans Starting at ₹1,999/month",
  description:
    "Choose from Starter, Professional, and Enterprise plans. Automate Gmail, social media, and content workflows with AgenticPilot AI agents. 14-day free trial, no credit card required.",
  path: "/pricing",
});

const faqItems = [
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a 14-day free trial for all plans. No credit card required to get started.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Do you offer custom solutions?",
    answer:
      "Yes, our Enterprise plan includes custom integrations and dedicated support for unique requirements.",
  },
];

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Pricing", url: `${SITE_URL}/pricing` },
        ])}
      />
      {children}
    </>
  );
}
