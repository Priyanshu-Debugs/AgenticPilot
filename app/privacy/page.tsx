import type { Metadata } from "next";
import { createPageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import Link from "next/link";
import { Bot, ShieldCheck } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "AgenticPilot's privacy policy explains how we collect, use, and protect your personal data when using our AI-powered business automation platform.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Privacy Policy", url: `${SITE_URL}/privacy` },
        ])}
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container-padding">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-x-2">
                <Bot className="size-6 sm:h-8 sm:w-8 text-primary" />
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  AgenticPilot
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container-padding py-16 lg:py-24">
          <article className="mx-auto max-w-3xl prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-0">
                  Privacy Policy
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: May 30, 2026
                </p>
              </div>
            </div>

            <section className="gap-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you use {SITE_NAME}, we collect information you provide directly to
                  us, including your name, email address, and any content you submit
                  through our platform. When you connect third-party services (Gmail,
                  X/Twitter, LinkedIn, Instagram), we access only the data necessary to
                  provide our automation services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our
                  AI-powered automation services; process your requests and send you
                  related information; communicate with you about products, services, and
                  events; and protect the security of our platform and users.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures including encryption at
                  rest and in transit, Row Level Security (RLS) in our database, and
                  secure OAuth authentication flows to protect your personal information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {SITE_NAME} integrates with third-party services such as Google (Gmail),
                  X/Twitter, LinkedIn, and Instagram. Your use of these integrations is
                  subject to the respective privacy policies of those services. We only
                  access the minimum permissions required to provide our automation
                  features.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as your account is
                  active or as needed to provide you services. You may request deletion of
                  your data at any time by contacting us at{" "}
                  <a
                    href="mailto:agenticpilot.team@gmail.com"
                    className="text-primary hover:underline"
                  >
                    agenticpilot.team@gmail.com
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to access, update, or delete your personal
                  information. You may also opt out of communications from us at any time.
                  To exercise these rights, contact us at the email address above.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us
                  at{" "}
                  <a
                    href="mailto:agenticpilot.team@gmail.com"
                    className="text-primary hover:underline"
                  >
                    agenticpilot.team@gmail.com
                  </a>
                  .
                </p>
              </div>
            </section>
          </article>
        </main>

        <footer className="border-t border-border py-8 bg-muted/30">
          <div className="container-padding text-center">
            <p className="text-muted-foreground text-sm">
              Copyright 2026 {SITE_NAME}. All rights reserved. ·{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
