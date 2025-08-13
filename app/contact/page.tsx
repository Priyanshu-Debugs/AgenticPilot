import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Mail, MessageSquare, Send } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function ContactPage() {
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ModeToggle />
              <Button variant="outline" asChild className="border-black dark:border-white bg-transparent text-sm">
                <Link href="/">
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Content */}
      <div className="max-w-4xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Get in <span className="underline decoration-2">Touch</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            Have questions about AgenticPilot? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Form */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Send us a message</span>
              </CardTitle>
              <CardDescription>Fill out the form below and we&apos;ll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">First Name</label>
                  <Input placeholder="John" className="border-gray-200 dark:border-gray-800" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">Last Name</label>
                  <Input placeholder="Doe" className="border-gray-200 dark:border-gray-800" />
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="john@example.com" className="border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="How can we help?" className="border-gray-200 dark:border-gray-800" />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  className="border-gray-200 dark:border-gray-800"
                />
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Email Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">For general inquiries and support:</p>
                <a href="mailto:agenticpilot.team@gmail.com" className="text-base sm:text-lg font-medium hover:underline break-all">
                  agenticpilot.team@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
