import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password — AgenticPilot",
  description:
    "Reset your AgenticPilot account password securely. Enter your new password to regain access to your AI automation dashboard.",
  path: "/auth/reset-password",
});

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
