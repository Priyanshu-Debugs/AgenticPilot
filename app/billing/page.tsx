import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, ArrowLeft, CreditCard, Download, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function BillingPage() {
  const invoices = [
    {
      id: "INV-001",
      date: "2024-12-01",
      amount: "$29.99",
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "INV-002",
      date: "2024-11-01",
      amount: "$29.99",
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "INV-003",
      date: "2024-10-01",
      amount: "$29.99",
      status: "paid",
      downloadUrl: "#"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <Link href="/" className="text-lg sm:text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Billing Content */}
      <div className="container-padding section-spacing">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Billing & Subscription</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your subscription and billing information</p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Current Plan */}
          <Card className="lg:col-span-2 card-elevated">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 sm:p-6 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Pro Plan</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">Perfect for growing businesses</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold">$29.99</p>
                  <p className="text-muted-foreground text-sm">per month</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Unlimited Gmail automation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Advanced inventory management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Instagram automation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1">Change Plan</Button>
                <Button variant="outline" className="flex-1">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Your default payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">•••• •••• •••• 1234</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Next Billing */}
          <Card className="lg:col-span-1 card-elevated">
            <CardHeader>
              <CardTitle>Next Billing</CardTitle>
              <CardDescription>Your upcoming payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">January 1, 2025</p>
                <p className="text-xl sm:text-2xl font-bold mt-2">$29.99</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="lg:col-span-3 card-elevated">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <p className="font-medium">{invoice.amount}</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {invoice.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
