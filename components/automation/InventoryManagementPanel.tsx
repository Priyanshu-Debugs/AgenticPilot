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
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Search, Filter, Download, Play, Pause } from "lucide-react"

export default function InventoryManagementPanel() {
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const inventoryItems = [
    { id: 1, name: "Wireless Headphones", sku: "WH-001", category: "Electronics", currentStock: 45, reorderPoint: 20, supplier: "TechSupply Co.", status: "In Stock", trend: "up" },
    { id: 2, name: "Bluetooth Speaker", sku: "BS-002", category: "Electronics", currentStock: 8, reorderPoint: 15, supplier: "AudioTech Ltd.", status: "Low Stock", trend: "down" },
    { id: 3, name: "USB-C Cable", sku: "UC-003", category: "Accessories", currentStock: 150, reorderPoint: 50, supplier: "CableCorp", status: "In Stock", trend: "up" },
    { id: 4, name: "Phone Case", sku: "PC-004", category: "Accessories", currentStock: 3, reorderPoint: 10, supplier: "ProtectTech", status: "Critical", trend: "down" },
    { id: 5, name: "Laptop Stand", sku: "LS-005", category: "Office", currentStock: 25, reorderPoint: 15, supplier: "OfficeSupply Inc.", status: "In Stock", trend: "up" },
  ]

  const recentAlerts = [
    { id: 1, type: "Low Stock", item: "Bluetooth Speaker", message: "Stock level below reorder point (8/15)", time: "5 minutes ago", severity: "warning" },
    { id: 2, type: "Critical Stock", item: "Phone Case", message: "Critical stock level reached (3/10)", time: "15 minutes ago", severity: "critical" },
    { id: 3, type: "Auto Reorder", item: "USB-C Cable", message: "Automatic reorder placed for 50 units", time: "2 hours ago", severity: "info" },
    { id: 4, type: "Stock Updated", item: "Wireless Headphones", message: "Stock level updated: +20 units received", time: "1 day ago", severity: "success" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <p className="text-gray-600 dark:text-gray-400">Automated inventory tracking and reorder management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={isAutomationActive ? "bg-green-600/20 text-green-500 border-green-600/30" : "bg-yellow-600/20 text-yellow-500 border-yellow-600/30"}>
            {isAutomationActive ? "Active" : "Paused"}
          </Badge>
          <Button
            onClick={() => setIsAutomationActive(!isAutomationActive)}
            className={isAutomationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isAutomationActive ? (<><Pause className="h-4 w-4 mr-2" /> Pause</>) : (<><Play className="h-4 w-4 mr-2" /> Start</>)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Items", value: "342", icon: Package, note: "+12 from last month" },
          { title: "Low Stock Alerts", value: "5", icon: AlertTriangle, note: "2 critical items" },
          { title: "Auto Reorders", value: "23", icon: TrendingUp, note: "This month" },
          { title: "Inventory Value", value: "$47.2K", icon: TrendingUp, note: "+8.2% from last month" },
        ].map((stat, idx) => {
          const Icon = stat.icon as any
          return (
            <Card key={idx} className="border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.note}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage your product inventory and stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-800">
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
                  {inventoryItems
                    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item) => (
                      <TableRow key={item.id} className="border-gray-200 dark:border-gray-800">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{item.sku}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{item.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.currentStock}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Reorder: {item.reorderPoint}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={item.status === "In Stock" ? "bg-green-600/20 text-green-500 border-green-600/30" : item.status === "Low Stock" ? "bg-yellow-600/20 text-yellow-500 border-yellow-600/30" : "bg-red-600/20 text-red-500 border-red-600/30"}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{item.supplier}</TableCell>
                        <TableCell>
                          {item.trend === "up" ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Inventory alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 p-4 rounded-lg border-l-4 ${alert.severity === "critical" ? "border-l-red-500" : alert.severity === "warning" ? "border-l-yellow-500" : alert.severity === "info" ? "border-l-blue-500" : "border-l-green-500"} bg-gray-50 dark:bg-gray-900/40`}>
                  <div className="flex-shrink-0 mt-1">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{alert.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{alert.item}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure inventory automation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Reorder</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Automatically place orders when stock reaches reorder point</div>
                </div>
                <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorder-buffer">Reorder Buffer (%)</Label>
                <Input id="reorder-buffer" type="number" defaultValue="20" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Additional buffer percentage for reorder calculations</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-threshold">Low Stock Alert Threshold</Label>
                <Input id="alert-threshold" type="number" defaultValue="10" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Days of stock remaining before low stock alert</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>Product movement and turnover rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Electronics</span><span className="text-sm font-medium">8.2x/year</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Accessories</span><span className="text-sm font-medium">12.5x/year</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Office Supplies</span><span className="text-sm font-medium">6.1x/year</span></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Cost Savings</CardTitle>
                <CardDescription>Automation benefits and cost reduction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Reduced Stockouts</span><span className="text-sm font-medium">$12,450</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Optimized Orders</span><span className="text-sm font-medium">$8,320</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">Time Saved</span><span className="text-sm font-medium">89 hours</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
