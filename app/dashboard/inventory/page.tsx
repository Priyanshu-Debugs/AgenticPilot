"use client"

import { useState, useMemo } from "react"
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
  Loader2,
} from "lucide-react"
import { InventoryItem, useInventory } from "@/utils/hooks/useInventory"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function InventoryManagement() {
  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "",
    current_stock: 0,
    min_stock: 10,
    max_stock: 100,
    reorder_point: 15,
    unit_price: 0,
    supplier: "",
  })

  // Use the inventory hook instead of mock data
  const {
    items: inventoryItems,
    orders: recentOrders,
    loading,
    addItem,
    updateItem,
    deleteItem,
    createOrder,
    getItemsNeedingReorder,
    getAnalytics,
  } = useInventory()

  // Get analytics data
  const analytics = getAnalytics()

  const analyticsDisplay = [
    { metric: "Total Items", value: String(analytics.totalItems), change: "+12 this month", icon: Package },
    { metric: "Low Stock Alerts", value: String(analytics.lowStockCount), change: `${analytics.itemsNeedingReorder} need reorder`, icon: AlertTriangle },
    { metric: "Inventory Value", value: `$${analytics.totalValue.toFixed(2)}`, change: "+8.2% from last month", icon: TrendingUp },
    { metric: "Avg Stock Level", value: `${analytics.avgStockLevel}%`, change: "Items below threshold", icon: TrendingDown },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Low Stock":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "Out of Stock":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "In Transit":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Processing":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const calculateStatus = (current: number, min: number, reorderPoint: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
    if (current === 0) return 'Out of Stock'
    if (current <= reorderPoint || current <= min) return 'Low Stock'
    return 'In Stock'
  }

  const getStockLevel = (current: number, min: number, max: number) => {
    if (current === 0) return { level: "empty", color: "bg-red-500" }
    if (current <= min) return { level: "low", color: "bg-amber-500" }
    if (current > max) return { level: "overstocked", color: "bg-purple-500" }

    const percentage = (current / max) * 100
    if (percentage > 70) return { level: "high", color: "bg-emerald-500" }
    return { level: "medium", color: "bg-primary" }
  }

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddItem = async () => {
    try {
      await addItem(newItem)
      setIsAddDialogOpen(false)
      setNewItem({
        name: "",
        sku: "",
        category: "",
        current_stock: 0,
        min_stock: 10,
        max_stock: 100,
        reorder_point: 15,
        unit_price: 0,
        supplier: "",
      })
    } catch (error) {
      // Error is handled by the hook with toast
    }
  }

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleUpdateItem = async () => {
    if (!editingItem) return

    try {
      await updateItem({
        id: editingItem.id,
        name: editingItem.name,
        sku: editingItem.sku,
        category: editingItem.category,
        current_stock: editingItem.current_stock,
        min_stock: editingItem.min_stock,
        max_stock: editingItem.max_stock,
        reorder_point: editingItem.reorder_point,
        unit_price: editingItem.unit_price,
        supplier: editingItem.supplier,
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      // Error is handled by the hook with toast
    }
  }

  const handleReorderAll = () => {
    const itemsNeedingReorder = inventoryItems.filter(item => item.current_stock <= item.reorder_point)
    toast.success(`Reorder request created for ${itemsNeedingReorder.length} item${itemsNeedingReorder.length !== 1 ? 's' : ''}`, {
      description: "Your supplier will be notified with the order details."
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              AI-powered inventory tracking and automated reordering
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Badge
            variant={isAutomationActive ? "default" : "secondary"}
            className={
              isAutomationActive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }
          >
            {isAutomationActive ? "Active" : "Paused"}
          </Badge>
          <Button
            onClick={() => setIsAutomationActive(!isAutomationActive)}
            variant={isAutomationActive ? "destructive" : "default"}
            size="sm"
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
        {loading ? (
          <div className="col-span-4 text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        ) : (
          analyticsDisplay.map((stat, index) => {
            const IconComponent = stat.icon
            const colors = ["text-muted-foreground", "text-amber-500", "text-emerald-500", "text-red-500"]

            return (
              <Card
                key={stat.metric}
                className="card-elevated"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${colors[index]}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="bg-muted">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <Card className="card-elevated">
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
                      const stockLevel = getStockLevel(item.current_stock, item.min_stock, item.max_stock)
                      const stockPercentage = (item.current_stock / item.max_stock) * 100

                      const dynamicStatus = calculateStatus(item.current_stock, item.min_stock, item.reorder_point)

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium text-foreground">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.supplier}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{item.current_stock} / {item.max_stock}</span>
                                <span className="text-muted-foreground">
                                  {stockPercentage.toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${stockLevel.color}`}
                                  style={{ width: `${Math.min(Math.max(stockPercentage, 5), 100)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(dynamicStatus)}>
                              {dynamicStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>${item.unit_price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>{item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : 'Never'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                                Edit
                              </Button>
                              {item.current_stock <= item.reorder_point && (
                                <Button size="sm" onClick={() => toast.success(`Reorder request created for ${item.name}`, { description: "Your supplier will be notified." })}>
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
          <Card className="card-elevated">
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
                  <div className="text-sm text-muted-foreground">
                    Automatically reorder items when they reach the reorder point
                  </div>
                </div>
                <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Items Requiring Reorder</h3>
                <div className="space-y-3">
                  {inventoryItems
                    .filter(item => item.current_stock <= item.reorder_point)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Current: {item.current_stock} | Reorder Point: {item.reorder_point}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(calculateStatus(item.current_stock, item.min_stock, item.reorder_point))}>
                            {calculateStatus(item.current_stock, item.min_stock, item.reorder_point)}
                          </Badge>
                          <Button size="sm" onClick={() => toast.success(`Reorder request created for ${item.name}`, { description: "Your supplier will be notified." })}>
                            Reorder Now
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>

                {inventoryItems.filter(item => item.current_stock <= item.reorder_point).length > 0 && (
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
            <Button onClick={() => toast.info("Manual order creation coming soon.", { description: "Use the inventory table to reorder individual items." })}>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>

          <Card className="card-elevated">
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
                        <TableCell className="font-medium">{order.item_name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString() : 'TBD'}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>${order.total_cost?.toFixed(2) || '0.00'}</TableCell>
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
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Inventory Insights</CardTitle>
                <CardDescription>Key metrics computed from your items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average Stock Level
                    </span>
                    <span className="text-sm font-medium">{analytics.avgStockLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Items Needing Reorder
                    </span>
                    <span className="text-sm font-medium">{analytics.itemsNeedingReorder} item{analytics.itemsNeedingReorder !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Inventory Value
                    </span>
                    <span className="text-sm font-medium">${analytics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Low Stock Alerts
                    </span>
                    <span className="text-sm font-medium">{analytics.lowStockCount} item{analytics.lowStockCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Inventory distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const categories = inventoryItems.reduce((acc, item) => {
                      const cat = item.category || 'Uncategorized'
                      if (!acc[cat]) acc[cat] = { count: 0, value: 0 }
                      acc[cat].count += item.current_stock
                      acc[cat].value += item.current_stock * item.unit_price
                      return acc
                    }, {} as Record<string, { count: number; value: number }>)
                    const totalValue = Object.values(categories).reduce((sum, c) => sum + c.value, 0)
                    return Object.entries(categories)
                      .sort((a, b) => b[1].value - a[1].value)
                      .map(([cat, data]) => (
                        <div key={cat} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{cat}</span>
                          <span className="text-sm font-medium">
                            {totalValue > 0 ? Math.round((data.value / totalValue) * 100) : 0}% (${data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </span>
                        </div>
                      ))
                  })()}
                  {inventoryItems.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No inventory data yet. Add items to see category breakdown.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Inventory Management Settings</CardTitle>
              <CardDescription>Configure your inventory automation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Low Stock Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications when items are running low
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Purchase Orders</Label>
                    <div className="text-sm text-muted-foreground">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safety-stock">Safety Stock Buffer (%)</Label>
                  <Input
                    id="safety-stock"
                    type="number"
                    defaultValue="15"
                  />
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">SKU</Label>
              <Input
                id="sku"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">Supplier</Label>
              <Input
                id="supplier"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current_stock" className="text-right">Current Stock</Label>
              <Input
                id="current_stock"
                type="number"
                value={newItem.current_stock}
                onChange={(e) => setNewItem({ ...newItem, current_stock: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min_stock" className="text-right">Min Stock</Label>
              <Input
                id="min_stock"
                type="number"
                value={newItem.min_stock}
                onChange={(e) => setNewItem({ ...newItem, min_stock: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_stock" className="text-right">Max Stock</Label>
              <Input
                id="max_stock"
                type="number"
                value={newItem.max_stock}
                onChange={(e) => setNewItem({ ...newItem, max_stock: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reorder_point" className="text-right">Reorder Point</Label>
              <Input
                id="reorder_point"
                type="number"
                value={newItem.reorder_point}
                onChange={(e) => setNewItem({ ...newItem, reorder_point: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit_price" className="text-right">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={newItem.unit_price}
                onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the product details and stock information.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-sku" className="text-right">SKU</Label>
                <Input
                  id="edit-sku"
                  value={editingItem.sku}
                  onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Input
                  id="edit-category"
                  value={editingItem.category || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-supplier" className="text-right">Supplier</Label>
                <Input
                  id="edit-supplier"
                  value={editingItem.supplier || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-current_stock" className="text-right">Current Stock</Label>
                <Input
                  id="edit-current_stock"
                  type="number"
                  value={editingItem.current_stock}
                  onChange={(e) => setEditingItem({ ...editingItem, current_stock: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-min_stock" className="text-right">Min Stock</Label>
                <Input
                  id="edit-min_stock"
                  type="number"
                  value={editingItem.min_stock}
                  onChange={(e) => setEditingItem({ ...editingItem, min_stock: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-max_stock" className="text-right">Max Stock</Label>
                <Input
                  id="edit-max_stock"
                  type="number"
                  value={editingItem.max_stock}
                  onChange={(e) => setEditingItem({ ...editingItem, max_stock: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-reorder_point" className="text-right">Reorder Point</Label>
                <Input
                  id="edit-reorder_point"
                  type="number"
                  value={editingItem.reorder_point}
                  onChange={(e) => setEditingItem({ ...editingItem, reorder_point: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-unit_price" className="text-right">Unit Price</Label>
                <Input
                  id="edit-unit_price"
                  type="number"
                  step="0.01"
                  value={editingItem.unit_price}
                  onChange={(e) => setEditingItem({ ...editingItem, unit_price: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
