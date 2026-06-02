import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In — AgenticPilot",
  description:
    "Sign in to your AgenticPilot account to manage your AI-powered business automations for Gmail, Twitter/X, LinkedIn, and Instagram.",
  path: "/auth/signin",
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
