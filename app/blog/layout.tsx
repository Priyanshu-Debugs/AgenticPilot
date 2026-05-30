import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog — AI & Automation Insights from AgenticPilot",
  description:
    "Explore articles on AI automation, business workflow optimization, and the latest in agentic AI technology. Stay updated with insights from the AgenticPilot team.",
  path: "/blog",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
