import type { Metadata } from "next";
import { createPageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import Link from "next/link";
import { Bot, FileText } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Read AgenticPilot's terms of service governing use of our AI-powered business automation platform, including account responsibilities, acceptable use, and limitations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Terms of Service", url: `${SITE_URL}/terms` },
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
                <FileText className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-0">
                  Terms of Service
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: May 30, 2026
                </p>
              </div>
            </div>

            <section className="gap-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using {SITE_NAME}, you agree to be bound by these Terms
                  of Service. If you do not agree to these terms, you may not use our
                  platform. We reserve the right to update these terms at any time, and
                  continued use constitutes acceptance of changes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {SITE_NAME} provides AI-powered business automation services including
                  automated email replies (Gmail), social media management (X/Twitter,
                  LinkedIn, Instagram), and content scheduling. Our services use artificial
                  intelligence to process and generate content on your behalf.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Account Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the security of your account
                  credentials and for all activities that occur under your account. You
                  must provide accurate, current, and complete information during
                  registration and keep your account information up to date.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use {SITE_NAME} for any unlawful purpose, to send spam
                  or unsolicited messages, to impersonate others, or to interfere with the
                  proper functioning of the platform. Automated actions must comply with
                  the terms of service of connected third-party platforms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The {SITE_NAME} platform, including its original content, features, and
                  functionality, is owned by the {SITE_NAME} team and is protected by
                  intellectual property laws. You retain ownership of content you create
                  or submit through our platform.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {SITE_NAME} is provided &ldquo;as is&rdquo; without warranties of any kind. We
                  shall not be liable for any indirect, incidental, special, consequential,
                  or punitive damages resulting from your use of the platform, including
                  any actions taken by our AI agents on your behalf.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Cancellation & Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may cancel your subscription at any time. Upon cancellation, you
                  will retain access to paid features until the end of your current billing
                  period. Refund requests are handled on a case-by-case basis.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, contact us at{" "}
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
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
