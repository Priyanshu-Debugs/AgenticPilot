import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact AgenticPilot — Get in Touch for AI Automation Solutions",
  description:
    "Questions about AgenticPilot? Reach us at agenticpilot.team@gmail.com. We respond within 24 hours during business days.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
