"use client"

import { useState, useEffect } from "react"
import { redirect, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Clock, Truck, Package, X, MapPin, Mail, Phone, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { getOrderById } from "@/lib/api"
import type { Order } from "@/types"

export default function OrderDetailsPage() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loadingOrder, setLoadingOrder] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // If user is not logged in and not loading, redirect to login
    if (!loading && !user) {
      redirect(`/login?redirect=orders/${id}`)
    }

    const fetchOrder = async () => {
      if (!id || typeof id !== 'string') return
      
      setLoadingOrder(true)
      try {
        const orderData = await getOrderById(id)
        
        // Check if order belongs to the logged-in user or if user is admin
        if (user?.id === orderData.userId || user?.isAdmin) {
          setOrder(orderData)
        } else {
          setError("You don't have permission to view this order")
          redirect("/orders")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Failed to load order details")
      } finally {
        setLoadingOrder(false)
      }
    }

    if (user) {
      fetchOrder()
    }
  }, [id, user, loading])

  if (loading || loadingOrder) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Button asChild className="mt-4">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Order not found</p>
        <Button asChild className="mt-4">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <Check className="h-5 w-5" />
      case "cancelled":
        return <X className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-600"
      case "shipped":
        return "bg-amber-100 text-amber-600"
      case "delivered":
        return "bg-green-100 text-green-600"
      case "cancelled":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
          <Link href="/orders" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{order._id.substring(0, 8)}</h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className={`${getStatusColor(order.orderStatus)} flex items-center px-3 py-1 rounded-full`}>
            {getStatusIcon(order.orderStatus)}
            <span className="ml-2 font-medium capitalize">{order.orderStatus}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-20 w-20 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">₹{item.price.toFixed(2)} each</span>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.totalAmount >= 500 ? "Free" : "₹50.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Track your order status</CardDescription>
            </CardHeader>
            <CardContent>
              {order.orderStatus !== "cancelled" ? (
                <div className="relative">
                  <div className="flex justify-between mb-6">
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        ${["processing", "shipped", "delivered"].includes(order.orderStatus) 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-gray-100 text-gray-400"}`}>
                        <Package className="h-5 w-5" />
                      </div>
                      <span className="text-sm mt-2 text-center">Order<br />Processing</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        ${["shipped", "delivered"].includes(order.orderStatus) 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-gray-100 text-gray-400"}`}>
                        <Truck className="h-5 w-5" />
                      </div>
                      <span className="text-sm mt-2 text-center">Order<br />Shipped</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        ${order.orderStatus === "delivered" 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-gray-100 text-gray-400"}`}>
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-sm mt-2 text-center">Order<br />Delivered</span>
                    </div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
                    <div className={`h-full bg-emerald-500`} style={{ 
                      width: order.orderStatus === "processing" 
                        ? "0%" 
                        : order.orderStatus === "shipped" 
                          ? "50%" 
                          : order.orderStatus === "delivered" 
                            ? "100%" 
                            : "0%" 
                    }}></div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {order.orderStatus === "processing" && (
                        "Your order is being processed. We'll update you when it ships."
                      )}
                      {order.orderStatus === "shipped" && (
                        "Your order has been shipped and is on its way to you."
                      )}
                      {order.orderStatus === "delivered" && (
                        "Your order has been delivered. Enjoy your products!"
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto bg-red-100 text-red-600 p-3 rounded-full inline-flex items-center justify-center mb-4">
                    <X className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Order Cancelled</h3>
                  <p className="text-gray-500">This order has been cancelled.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 mb-4">
                <CircleDollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-medium">Payment Method</h3>
                  <p className="text-gray-600">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment"}
                  </p>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Delivery Address</h3>
                    <p className="text-gray-600">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone Number</h3>
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">{order.shippingAddress.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help? */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions or issues with your order, please contact our customer support team.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
