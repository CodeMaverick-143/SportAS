"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, ArrowRight, Truck, Package, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { getOrders } from "@/lib/api"
import type { Order } from "@/types"

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // If user is not logged in and not loading, redirect to login
    if (!loading && !user) {
      redirect("/login?redirect=orders")
    }

    // Fetch user orders
    if (user) {
      const fetchOrders = async () => {
        setLoadingOrders(true)
        try {
          const userOrders = await getOrders({ userId: user.id })
          setOrders(userOrders)
        } catch (error) {
          console.error("Error fetching orders:", error)
        } finally {
          setLoadingOrders(false)
        }
      }

      fetchOrders()
    }
  }, [user, loading])

  // Filter orders based on status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.orderStatus === filterStatus
    const matchesSearch = 
      searchQuery === "" || 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesStatus && matchesSearch
  })

  // Group orders by status
  const pendingOrders = orders.filter((order) => 
    order.orderStatus === "processing" || order.orderStatus === "pending"
  )
  const shippedOrders = orders.filter((order) => order.orderStatus === "shipped")
  const deliveredOrders = orders.filter((order) => order.orderStatus === "delivered")
  const cancelledOrders = orders.filter((order) => order.orderStatus === "cancelled")

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading your orders...</p>
      </div>
    )
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-50 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-sm text-gray-500">Order #</span>
          <span className="font-medium ml-1">{order._id.substring(0, 8)}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Date:</span>
          <span className="font-medium ml-1">
            {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Total:</span>
          <span className="font-medium ml-1">₹{order.totalAmount.toFixed(2)}</span>
        </div>
        <div>
          <Badge
            variant={
              order.orderStatus === "delivered"
                ? "default"
                : order.orderStatus === "shipped"
                ? "secondary"
                : order.orderStatus === "cancelled"
                ? "destructive"
                : "outline"
            }
            className="capitalize"
          >
            {order.orderStatus}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
        <ul className="space-y-2 mb-4">
          {order.items.slice(0, 3).map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.name} <span className="text-gray-500">x{item.quantity}</span>
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-sm text-gray-500">
              +{order.items.length - 3} more item(s)
            </li>
          )}
        </ul>
        
        {/* Order Status Tracker */}
        {order.orderStatus !== "cancelled" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  ["processing", "shipped", "delivered"].includes(order.orderStatus) 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <Package className="h-3 w-3" />
                </div>
                <span className="text-xs mt-1">Processing</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${
                ["shipped", "delivered"].includes(order.orderStatus) 
                  ? "bg-emerald-500" 
                  : "bg-gray-200"
              }`} />
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  ["shipped", "delivered"].includes(order.orderStatus) 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <Truck className="h-3 w-3" />
                </div>
                <span className="text-xs mt-1">Shipped</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${
                order.orderStatus === "delivered" 
                  ? "bg-emerald-500" 
                  : "bg-gray-200"
              }`} />
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  order.orderStatus === "delivered" 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-xs mt-1">Delivered</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-emerald-600 border-emerald-600"
          >
            <Link href={`/orders/${order._id}`} className="flex items-center gap-1">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-emerald-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full inline-flex items-center justify-center mb-2">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Processing</h3>
              <p className="text-3xl font-bold">{pendingOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full inline-flex items-center justify-center mb-2">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Shipped</h3>
              <p className="text-3xl font-bold">{shippedOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full inline-flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Delivered</h3>
              <p className="text-3xl font-bold">{deliveredOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-gray-100 text-gray-600 p-3 rounded-full inline-flex items-center justify-center mb-2">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-medium">Total Orders</h3>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-[300px]"
                />
              </div>
              <div>
                <select
                  className="w-full sm:w-auto px-3 py-2 border rounded-md text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loadingOrders ? (
                <p className="text-center py-8">Loading your orders...</p>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No orders found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? "No orders match your search criteria." 
                      : "You haven't placed any orders yet."}
                  </p>
                  {!searchQuery && (
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="processing">
              {loadingOrders ? (
                <p className="text-center py-8">Loading your orders...</p>
              ) : pendingOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No processing orders</h3>
                  <p className="text-gray-500">You don't have any orders currently being processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shipped">
              {loadingOrders ? (
                <p className="text-center py-8">Loading your orders...</p>
              ) : shippedOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No shipped orders</h3>
                  <p className="text-gray-500">You don't have any orders currently in transit.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shippedOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="delivered">
              {loadingOrders ? (
                <p className="text-center py-8">Loading your orders...</p>
              ) : deliveredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No delivered orders</h3>
                  <p className="text-gray-500">You don't have any delivered orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveredOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
