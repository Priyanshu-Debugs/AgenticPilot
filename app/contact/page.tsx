"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/shared/Navigation"
import { Bot, Mail, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function ContactPage() {
  const handleGetStarted = () => {
    window.location.href = "/auth/signup"
  }

  const handleSignIn = () => {
    window.location.href = "/auth/signin"
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation 
        onSignIn={handleSignIn}
        onSignUp={handleGetStarted}
      />

      {/* Contact Content */}
      <div className="container-padding section-spacing">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            Get in <span className="underline decoration-2 decoration-primary">Touch</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about AgenticPilot? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="card-elevated h-fit">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span>Send us a message</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Subject</label>
                <Input placeholder="How can we help?" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Message</label>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Email Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm sm:text-base">For general inquiries and support:</p>
                <a 
                  href="mailto:agenticpilot.team@gmail.com" 
                  className="text-lg font-medium text-primary hover:underline transition-colors"
                >
                  agenticpilot.team@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader className="pb-4">
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Monday - Friday: 9:00 AM - 6:00 PM (EST)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30 mt-16">
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
