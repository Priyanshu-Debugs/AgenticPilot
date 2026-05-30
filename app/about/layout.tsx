import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About AgenticPilot — Meet the Team Behind AI Business Automation",
  description:
    "Built by Computer Engineering students at VGEC, AgenticPilot automates Gmail, Twitter/X, LinkedIn, and Instagram with intelligent AI agents. Meet the founders and learn our story.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
