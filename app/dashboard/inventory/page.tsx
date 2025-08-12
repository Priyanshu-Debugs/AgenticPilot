"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Package,
  Bot,
  Sun,
  Moon,
  ArrowLeft,
  Play,
  Pause,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function InventoryManagement() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const inventoryItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      currentStock: 45,
      reorderPoint: 20,
      maxStock: 100,
      supplier: "TechSupply Co.",
      lastOrdered: "2024-01-15",
      status: "In Stock",
      trend: "up",
    },
    {
      id: 2,
      name: "Bluetooth Speaker",
      sku: "BS-002",
      category: "Electronics",
      currentStock: 8,
      reorderPoint: 15,
      maxStock: 50,
      supplier: "AudioTech Ltd.",
      lastOrdered: "2024-01-10",
      status: "Low Stock",
      trend: "down",
    },
    {
      id: 3,
      name: "USB-C Cable",
      sku: "UC-003",
      category: "Accessories",
      currentStock: 150,
      reorderPoint: 50,
      maxStock: 200,
      supplier: "CableCorp",
      lastOrdered: "2024-01-20",
      status: "In Stock",
      trend: "up",
    },
    {
      id: 4,
      name: "Phone Case",
      sku: "PC-004",
      category: "Accessories",
      currentStock: 3,
      reorderPoint: 10,
      maxStock: 75,
      supplier: "ProtectTech",
      lastOrdered: "2024-01-05",
      status: "Critical",
      trend: "down",
    },
    {
      id: 5,
      name: "Laptop Stand",
      sku: "LS-005",
      category: "Office",
      currentStock: 25,
      reorderPoint: 15,
      maxStock: 40,
      supplier: "OfficeSupply Inc.",
      lastOrdered: "2024-01-18",
      status: "In Stock",
      trend: "up",
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      type: "Low Stock",
      item: "Bluetooth Speaker",
      message: "Stock level below reorder point (8/15)",
      time: "5 minutes ago",
      severity: "warning",
    },
    {
      id: 2,
      type: "Critical Stock",
      item: "Phone Case",
      message: "Critical stock level reached (3/10)",
      time: "15 minutes ago",
      severity: "critical",
    },
    {
      id: 3,
      type: "Auto Reorder",
      item: "USB-C Cable",
      message: "Automatic reorder placed for 50 units",
      time: "2 hours ago",
      severity: "info",
    },
    {
      id: 4,
      type: "Stock Updated",
      item: "Wireless Headphones",
      message: "Stock level updated: +20 units received",
      time: "1 day ago",
      severity: "success",
    },
  ]

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-600/20 text-green-400 border-green-600/30"
      case "Low Stock":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
      case "Critical":
        return "bg-red-600/20 text-red-400 border-red-600/30"
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30"
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "info":
        return "border-l-blue-500"
      case "success":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Navigation */}
      <nav
        className={`border-b ${isDarkMode ? "border-gray-800 bg-gray-950/80" : "border-gray-200 bg-white/80"} backdrop-blur-sm sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-2 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-500" />
              <Link href="/" className="text-xl font-bold">
                AgenticPilot
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Automated inventory tracking and reorder management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge
              variant={isAutomationActive ? "default" : "secondary"}
              className={isAutomationActive ? "bg-green-600/20 text-green-400 border-green-600/30" : ""}
            >
              {isAutomationActive ? "Active" : "Paused"}
            </Badge>
            <Button
              onClick={() => setIsAutomationActive(!isAutomationActive)}
              className={isAutomationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isAutomationActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>+12 from last month</p>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>2 critical items</p>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto Reorders</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>This month</p>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$47.2K</div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>+8.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                  />
                </div>
                <Button variant="outline" className={`${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className={`${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* Inventory Table */}
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>Manage your product inventory and stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className={`${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className={`${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {item.sku}
                        </TableCell>
                        <TableCell className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {item.category}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                              Reorder: {item.reorderPoint}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {item.supplier}
                        </TableCell>
                        <TableCell>
                          {item.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Inventory alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-l-4 ${getAlertColor(alert.severity)} ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.type}</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{alert.time}</p>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{alert.item}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
                <CardDescription>Configure inventory automation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Reorder</Label>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Automatically place orders when stock reaches reorder point
                    </div>
                  </div>
                  <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorder-buffer">Reorder Buffer (%)</Label>
                  <Input
                    id="reorder-buffer"
                    type="number"
                    defaultValue="20"
                    className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  />
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Additional buffer percentage for reorder calculations
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-threshold">Low Stock Alert Threshold</Label>
                  <Input
                    id="alert-threshold"
                    type="number"
                    defaultValue="10"
                    className={`${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  />
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Days of stock remaining before low stock alert
                  </p>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <CardTitle>Inventory Turnover</CardTitle>
                  <CardDescription>Product movement and turnover rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Electronics</span>
                      <span className="text-sm font-medium">8.2x/year</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Accessories</span>
                      <span className="text-sm font-medium">12.5x/year</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Office Supplies
                      </span>
                      <span className="text-sm font-medium">6.1x/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>Automation benefits and cost reduction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Reduced Stockouts
                      </span>
                      <span className="text-sm font-medium">$12,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Optimized Orders
                      </span>
                      <span className="text-sm font-medium">$8,320</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Time Saved</span>
                      <span className="text-sm font-medium">89 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
