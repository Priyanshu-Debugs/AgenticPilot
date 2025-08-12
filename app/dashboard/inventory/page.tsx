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
  Menu,
  X,
  Mail,
  Instagram,
  Play,
  Pause,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function InventoryManagement() {
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const automations = [
    {
      id: "gmail",
      title: "Gmail Auto Reply",
      icon: Mail,
      status: "Active",
    },
    {
      id: "inventory",
      title: "Inventory Management",
      icon: Package,
      status: "Active",
    },
    {
      id: "instagram",
      title: "Instagram Automation",
      icon: Instagram,
      status: "Soon",
    },
  ]

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
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
      value: 2250.0,
    },
    {
      id: 2,
      name: "Gaming Mouse",
      sku: "GM-002",
      category: "Electronics",
      currentStock: 15,
      reorderPoint: 25,
      maxStock: 75,
      supplier: "GameGear Ltd.",
      lastOrdered: "2024-01-10",
      status: "Low Stock",
      value: 750.0,
    },
    {
      id: 3,
      name: "Office Chair",
      sku: "OC-003",
      category: "Furniture",
      currentStock: 8,
      reorderPoint: 10,
      maxStock: 30,
      supplier: "ComfortSeating Inc.",
      lastOrdered: "2024-01-12",
      status: "Low Stock",
      value: 1600.0,
    },
    {
      id: 4,
      name: "Laptop Stand",
      sku: "LS-004",
      category: "Accessories",
      currentStock: 32,
      reorderPoint: 15,
      maxStock: 50,
      supplier: "DeskTech Solutions",
      lastOrdered: "2024-01-08",
      status: "In Stock",
      value: 960.0,
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      sku: "BS-005",
      category: "Electronics",
      currentStock: 0,
      reorderPoint: 20,
      maxStock: 60,
      supplier: "AudioPro Systems",
      lastOrdered: "2024-01-05",
      status: "Out of Stock",
      value: 0.0,
    },
  ]

  const analytics = [
    { metric: "Total Items", value: "1,247", change: "+23 this month" },
    { metric: "Low Stock Items", value: "23", change: "-5 from last week" },
    { metric: "Total Value", value: "$127,500", change: "+8.2% from last month" },
    { metric: "Auto Orders", value: "45", change: "This month" },
  ]

  const recentOrders = [
    {
      id: 1,
      item: "Wireless Headphones",
      quantity: 50,
      supplier: "TechSupply Co.",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-22",
      status: "In Transit",
      total: 2500.0,
    },
    {
      id: 2,
      item: "Gaming Mouse",
      quantity: 30,
      supplier: "GameGear Ltd.",
      orderDate: "2024-01-10",
      expectedDelivery: "2024-01-18",
      status: "Delivered",
      total: 1500.0,
    },
    {
      id: 3,
      item: "Office Chair",
      quantity: 15,
      supplier: "ComfortSeating Inc.",
      orderDate: "2024-01-12",
      expectedDelivery: "2024-01-25",
      status: "Processing",
      total: 3000.0,
    },
  ]

  const getStockStatus = (current: number, reorderPoint: number) => {
    if (current === 0) return { status: "Out of Stock", color: "bg-red-600/20 text-red-400 border-red-600/30" }
    if (current <= reorderPoint) return { status: "Low Stock", color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" }
    return { status: "In Stock", color: "bg-green-600/20 text-green-400 border-green-600/30" }
  }

  const getOrderStatus = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-600/20 text-green-400 border-green-600/30"
      case "In Transit":
        return "bg-blue-600/20 text-blue-400 border-blue-600/30"
      case "Processing":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30"
    }
  }

  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
      {/* Sidebar - Same as dashboard */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-black dark:text-white" />
              <Link href="/" className="text-xl font-bold">
                AgenticPilot
              </Link>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Automations
              </h3>

              {automations.map((automation) => {
                const IconComponent = automation.icon

                return (
                  <div key={automation.id} className="space-y-2">
                    {automation.id === "inventory" ? (
                      <div className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all bg-black/5 dark:bg-white/5`}>
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <span className="font-medium">{automation.title}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            automation.status === "Active"
                              ? "border-green-500 text-green-600 dark:text-green-400"
                              : automation.status === "Paused"
                                ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                                : "border-gray-500 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {automation.status}
                        </Badge>
                      </div>
                    ) : (
                      <Link href={automation.id === "gmail" ? "/dashboard/gmail" : automation.id === "instagram" ? "/dashboard/instagram" : "/dashboard"}>
                        <div className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium">{automation.title}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              automation.status === "Active"
                                ? "border-green-500 text-green-600 dark:text-green-400"
                                : automation.status === "Paused"
                                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                                  : "border-gray-500 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {automation.status}
                          </Badge>
                        </div>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation - Same as dashboard */}
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">Inventory Management</h1>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </Link>
                <ModeToggle />
              </div>
            </div>
          </div>
        </nav>

        {/* Inventory Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time inventory tracking and automated reordering
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant={isAutomationActive ? "default" : "secondary"}
                className={
                  isAutomationActive
                    ? "bg-green-600/20 text-green-400 border-green-600/30"
                    : "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                }
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
            {analytics.map((stat, index) => {
              const icons = [Package, AlertTriangle, TrendingUp, TrendingDown]
              const colors = ["text-blue-500", "text-yellow-500", "text-green-500", "text-purple-500"]
              const IconComponent = icons[index]

              return (
                <Card key={stat.metric} className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                    <IconComponent className={`h-4 w-4 ${colors[index]}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{stat.change}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Current Inventory</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Last Ordered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => {
                        const stockStatus = getStockStatus(item.currentStock, item.reorderPoint)
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span>{item.currentStock}</span>
                                <span className="text-xs text-gray-500">/ {item.maxStock}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                            </TableCell>
                            <TableCell>${item.value.toFixed(2)}</TableCell>
                            <TableCell>{item.supplier}</TableCell>
                            <TableCell>{item.lastOrdered}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Expected Delivery</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.item}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell>{order.expectedDelivery}</TableCell>
                          <TableCell>
                            <Badge className={getOrderStatus(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                  <CardDescription>Manage your supplier relationships and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {["TechSupply Co.", "GameGear Ltd.", "ComfortSeating Inc.", "DeskTech Solutions", "AudioPro Systems"].map((supplier, index) => (
                        <Card key={supplier} className="border-gray-200 dark:border-gray-800">
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{supplier}</h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <p>Contact: supplier{index + 1}@email.com</p>
                              <p>Phone: +1 (555) {123 + index}-{4567 + index}</p>
                              <p>Rating: 4.{8 - index}/5</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Inventory Turnover</CardTitle>
                    <CardDescription>How quickly inventory is sold and replaced</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Electronics</span>
                        <span className="text-sm font-medium">12.3x/year</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Furniture</span>
                        <span className="text-sm font-medium">8.7x/year</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Accessories</span>
                        <span className="text-sm font-medium">15.2x/year</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                    <CardDescription>Breakdown of inventory costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Holding Cost</span>
                        <span className="text-sm font-medium">$2,340/month</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Ordering Cost</span>
                        <span className="text-sm font-medium">$890/month</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Shortage Cost</span>
                        <span className="text-sm font-medium">$156/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                  <CardDescription>Configure your inventory management automation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto Reordering</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically reorder items when they reach reorder point
                      </div>
                    </div>
                    <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Reorder Quantity</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Low Stock Alert Threshold</Label>
                    <Input
                      type="number"
                      placeholder="20"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}
    </div>
  )
}
