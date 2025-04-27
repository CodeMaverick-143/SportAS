"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <Link href={`/product/${product._id}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount > 0 && <Badge className="absolute top-2 right-2 bg-red-500">{product.discount}% OFF</Badge>}
      </Link>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product._id}`} className="font-medium hover:underline">
            {product.name}
          </Link>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{((product.price * 100) / (100 - product.discount)).toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-emerald-600 hover:bg-emerald-700">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
