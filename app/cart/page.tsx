"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout.",
        variant: "destructive",
      })
      router.push("/login?redirect=cart")
      return
    }

    router.push("/checkout")
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product._id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/4 aspect-square relative">
                  <Image
                    src={item.product.imageUrl || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">
                        <Link href={`/product/${item.product._id}`} className="hover:underline">
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>

                  <div className="mt-auto flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                      {item.quantity > 1 && (
                        <div className="text-sm text-gray-500">₹{item.product.price.toFixed(2)} each</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => clearCart()}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Clear Cart
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{cartTotal >= 500 ? "Free" : "₹50.00"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{(cartTotal >= 500 ? cartTotal : cartTotal + 50).toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500">
                {cartTotal < 500 && <p>Add items worth ₹{(500 - cartTotal).toFixed(2)} more for free shipping</p>}
                <p>Taxes calculated at checkout</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
