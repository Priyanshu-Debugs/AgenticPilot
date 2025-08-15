"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/shared/Navigation"
import { Check, Bot, Bell } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Pricing() {
  const handleGetStarted = () => {
    window.location.href = "/auth/signup"
  }

  const handleSignIn = () => {
    window.location.href = "/auth/signin"
  }

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started with automation",
      features: [
        "Gmail Auto Reply (up to 500 emails/month)",
        "Basic Inventory Management",
        "Email Support",
        "Dashboard Access",
        "1 User Account",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses with advanced automation needs",
      features: [
        "Gmail Auto Reply (up to 2,000 emails/month)",
        "Advanced Inventory Management",
        "Instagram Automation (10 posts/month)",
        "Priority Support",
        "Dashboard & Analytics",
        "Up to 5 User Accounts",
        "Custom Templates",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations requiring unlimited automation",
      features: [
        "Unlimited Gmail Auto Reply",
        "Full Inventory Management Suite",
        "Unlimited Instagram Automation",
        "24/7 Phone Support",
        "Advanced Analytics",
        "Unlimited User Accounts",
        "Custom Integrations",
        "Dedicated Account Manager",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation 
        onSignIn={handleSignIn}
        onSignUp={handleGetStarted}
      />

      {/* Pricing Content */}
      <div className="container-padding section-spacing">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your business automation needs. All plans include our core features with no
            hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative card-elevated h-full ${
                plan.popular ? "ring-2 ring-primary border-primary/50" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-center max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 tracking-tight">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="text-left card-elevated p-6">
              <h3 className="font-semibold mb-3 text-foreground">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left card-elevated p-6">
              <h3 className="font-semibold mb-3 text-foreground">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We offer a 14-day free trial for all plans. No credit card required to get started.
              </p>
            </div>
            <div className="text-left card-elevated p-6">
              <h3 className="font-semibold mb-3 text-foreground">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="text-left card-elevated p-6">
              <h3 className="font-semibold mb-3 text-foreground">Do you offer custom solutions?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Yes, our Enterprise plan includes custom integrations and dedicated support for unique requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container-padding text-center">
          <p className="text-muted-foreground text-sm sm:text-base">
            Contact us:{" "}
            <a
              href="mailto:agenticpilot.team@gmail.com"
              className="text-primary hover:underline transition-colors"
            >
              agenticpilot.team@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
