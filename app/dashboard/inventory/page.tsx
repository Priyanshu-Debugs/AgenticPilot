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

export default function InventoryManagement() {
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const inventoryItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      reorderPoint: 15,
      unitPrice: 129.99,
      status: "In Stock",
      supplier: "Tech Corp",
      lastRestocked: "2024-01-15",
    },
    {
      id: 2,
      name: "Smartphone Case",
      sku: "SC-002",
      category: "Accessories",
      currentStock: 5,
      minStock: 20,
      maxStock: 200,
      reorderPoint: 25,
      unitPrice: 24.99,
      status: "Low Stock",
      supplier: "Mobile Plus",
      lastRestocked: "2024-01-10",
    },
    {
      id: 3,
      name: "USB Cable",
      sku: "UC-003",
      category: "Accessories",
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      reorderPoint: 75,
      unitPrice: 12.99,
      status: "In Stock",
      supplier: "Cable Co",
      lastRestocked: "2024-01-20",
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      sku: "BS-004",
      category: "Electronics",
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
      reorderPoint: 8,
      unitPrice: 89.99,
      status: "Out of Stock",
      supplier: "Audio Systems",
      lastRestocked: "2023-12-28",
    },
    {
      id: 5,
      name: "Laptop Stand",
      sku: "LS-005",
      category: "Office",
      currentStock: 35,
      minStock: 15,
      maxStock: 80,
      reorderPoint: 20,
      unitPrice: 45.99,
      status: "In Stock",
      supplier: "Office Pro",
      lastRestocked: "2024-01-18",
    },
  ]

  const analytics = [
    { metric: "Total Items", value: "215", change: "+12 this month", icon: Package },
    { metric: "Low Stock Alerts", value: "3", change: "2 new alerts", icon: AlertTriangle },
    { metric: "Inventory Value", value: "$45,230", change: "+8.2% from last month", icon: TrendingUp },
    { metric: "Reorder Needed", value: "5", change: "Items below threshold", icon: TrendingDown },
  ]

  const recentOrders = [
    {
      id: 1,
      item: "Wireless Headphones",
      quantity: 50,
      supplier: "Tech Corp",
      orderDate: "2024-01-15",
      expectedDelivery: "2024-01-22",
      status: "In Transit",
      total: 2500.0,
    },
    {
      id: 2,
      item: "Smartphone Case",
      quantity: 100,
      supplier: "Mobile Plus",
      orderDate: "2024-01-10",
      expectedDelivery: "2024-01-18",
      status: "Delivered",
      total: 2499.0,
    },
    {
      id: 3,
      item: "USB Cable",
      quantity: 200,
      supplier: "Cable Co",
      orderDate: "2024-01-12",
      expectedDelivery: "2024-01-25",
      status: "Processing",
      total: 2598.0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-600/20 text-green-400 border-green-600/30"
      case "Low Stock":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
      case "Out of Stock":
        return "bg-red-600/20 text-red-400 border-red-600/30"
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30"
    }
  }

  const getOrderStatusColor = (status: string) => {
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

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current === 0) return { level: "empty", color: "bg-red-500" }
    if (current <= min) return { level: "low", color: "bg-yellow-500" }
    if (percentage > 70) return { level: "high", color: "bg-green-500" }
    return { level: "medium", color: "bg-blue-500" }
  }

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleReorderAll = () => {
    const itemsNeedingReorder = inventoryItems.filter(item => item.currentStock <= item.reorderPoint)
    // TODO: Integrate with ordering system API to reorder items
    // For now, show alert with items that need reordering
    alert(`${itemsNeedingReorder.length} items need reordering`)
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600/20 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Inventory Management</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              AI-powered inventory tracking and automated reordering
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {analytics.map((stat, index) => {
          const IconComponent = stat.icon
          const colors = ["text-gray-500", "text-yellow-500", "text-green-500", "text-red-500"]

          return (
            <Card
              key={stat.metric}
              className="border-gray-200 dark:border-gray-800"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                <IconComponent className={`h-4 w-4 ${colors[index]}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
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
          <TabsTrigger value="reorder">Auto Reorder</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Search and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              <Button variant="outline" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Product</TableHead>
                      <TableHead className="whitespace-nowrap">SKU</TableHead>
                      <TableHead className="whitespace-nowrap">Category</TableHead>
                      <TableHead className="whitespace-nowrap">Stock Level</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Unit Price</TableHead>
                      <TableHead className="whitespace-nowrap">Last Restocked</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock)
                    const stockPercentage = (item.currentStock / item.maxStock) * 100

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {item.supplier}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{item.currentStock} / {item.maxStock}</span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {stockPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${stockLevel.color}`}
                                style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${item.unitPrice}</TableCell>
                        <TableCell>{item.lastRestocked}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Edit
                            </Button>
                            {item.currentStock <= item.reorderPoint && (
                              <Button size="sm">
                                Reorder
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Automatic Reordering</CardTitle>
              <CardDescription>
                AI-powered automatic reordering based on stock levels and sales patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Auto Reorder</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically reorder items when they reach the reorder point
                  </div>
                </div>
                <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Items Requiring Reorder</h3>
                <div className="space-y-3">
                  {inventoryItems
                    .filter(item => item.currentStock <= item.reorderPoint)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700/30"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Current: {item.currentStock} | Reorder Point: {item.reorderPoint}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Button size="sm">
                            Reorder Now
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>

                {inventoryItems.filter(item => item.currentStock <= item.reorderPoint).length > 0 && (
                  <Button onClick={handleReorderAll} className="w-full">
                    Reorder All Items
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Item</TableHead>
                      <TableHead className="whitespace-nowrap">Quantity</TableHead>
                      <TableHead className="whitespace-nowrap">Supplier</TableHead>
                      <TableHead className="whitespace-nowrap">Order Date</TableHead>
                      <TableHead className="whitespace-nowrap">Expected Delivery</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Total</TableHead>
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
                        <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Inventory Insights</CardTitle>
                <CardDescription>Key metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Average Stock Level
                    </span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Stock Turnover Rate
                    </span>
                    <span className="text-sm font-medium">4.2x per year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Carrying Cost
                    </span>
                    <span className="text-sm font-medium">$2,150/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Stockout Incidents
                    </span>
                    <span className="text-sm font-medium">2 this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Inventory distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Electronics
                    </span>
                    <span className="text-sm font-medium">45% ($20,250)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Accessories
                    </span>
                    <span className="text-sm font-medium">35% ($15,830)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Office
                    </span>
                    <span className="text-sm font-medium">20% ($9,150)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Inventory Management Settings</CardTitle>
              <CardDescription>Configure your inventory automation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Low Stock Alerts</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications when items are running low
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Purchase Orders</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically create purchase orders for suppliers
                    </div>
                  </div>
                  <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorder-threshold">Default Reorder Threshold (%)</Label>
                  <Input
                    id="reorder-threshold"
                    type="number"
                    defaultValue="20"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safety-stock">Safety Stock Buffer (%)</Label>
                  <Input
                    id="safety-stock"
                    type="number"
                    defaultValue="15"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
