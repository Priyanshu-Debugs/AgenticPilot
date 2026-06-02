import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign Up — AgenticPilot",
  description:
    "Create your AgenticPilot account to start automating Gmail, Twitter/X, LinkedIn, and Instagram with AI-powered agents.",
  path: "/auth/signup",
});

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
