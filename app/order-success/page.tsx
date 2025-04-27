"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrderById } from "@/lib/api"
import type { Order } from "@/types"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-8">We couldn't find the order you're looking for.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-4">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="font-medium">
          Order ID: <span className="font-bold">{order._id}</span>
        </p>
      </div>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-md">
            <Package className="h-5 w-5" />
            <div>
              <p className="font-medium">Order Status: {order.orderStatus}</p>
              <p className="text-sm">
                {order.paymentMethod === "cod"
                  ? "Payment will be collected upon delivery"
                  : "Payment has been processed"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-1">
              <span>Subtotal</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Shipping</span>
              <span>{order.totalAmount >= 500 ? "Free" : "₹50.00"}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/orders">View All Orders</Link>
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
