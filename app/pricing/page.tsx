"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Bot, Bell } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Pricing() {
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-black dark:text-white" />
              <Link href="/" className="text-lg sm:text-xl font-bold">
                AgenticPilot
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/#features"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>
              <ModeToggle />
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your business automation needs. All plans include our core features with no
            hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-gray-200 dark:border-gray-800 ${plan.popular ? "ring-2 ring-black dark:ring-white" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white dark:bg-white dark:text-black">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2 sm:space-x-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      : "border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-sm sm:text-base font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-sm sm:text-base font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                We offer a 14-day free trial for all plans. No credit card required to get started.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-sm sm:text-base font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-sm sm:text-base font-semibold mb-2">Do you offer custom solutions?</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Yes, our Enterprise plan includes custom integrations and dedicated support for unique requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Contact us:{" "}
            <a
              href="mailto:agenticpilot.team@gmail.com"
              className="hover:text-black dark:hover:text-white transition-colors break-all"
            >
              agenticpilot.team@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
