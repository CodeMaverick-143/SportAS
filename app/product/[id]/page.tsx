"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/types"
import { getProductById, getRelatedProducts } from "@/lib/api"
import { Suspense } from "react"
import ProductCard from "@/components/product-card"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        // Fetch product data
        const productData = await getProductById(id as string)
        if (!productData) {
          setLoading(false)
          return
        }
        
        setProduct(productData)

        // Fetch related products
        const related = await getRelatedProducts(id as string, productData.category)
        setRelatedProducts(related)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 aspect-square bg-gray-200 animate-pulse rounded-lg" />
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
            <div className="h-12 bg-gray-200 rounded animate-pulse mt-6" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Product Image */}
        <div className="md:w-1/2 relative">
          <div className="sticky top-20">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image 
                src={product.imageUrl || "/placeholder.svg"} 
                alt={product.name} 
                fill 
                className="object-cover" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <div className="mb-2">
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold">₹{product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-lg text-gray-500 line-through">
                ₹{Math.round((product.price * 100) / (100 - product.discount)).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <Badge variant={product.stock > 0 ? "success" : "destructive"} className="px-2 py-1 text-white">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
            {product.stock > 0 && <span className="text-sm text-gray-500">{product.stock} items available</span>}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 mb-6"
            disabled={product.stock <= 0}
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Free Delivery</h3>
                <p className="text-sm text-gray-500">Free delivery on orders above ₹500</p>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="specifications" className="flex-1">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <p className="text-gray-700">{product.longDescription || product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <ul className="space-y-2">
                {product.specifications?.map((spec, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium w-1/3">{spec.name}:</span>
                    <span className="text-gray-700">{spec.value}</span>
                  </li>
                )) || <li className="text-gray-500">No specifications available</li>}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              <p className="text-gray-500">
                {product.reviews > 0
                  ? `This product has ${product.reviews} reviews with an average rating of ${product.rating} stars.`
                  : "This product has no reviews yet."}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <Separator className="mb-8" />
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No related products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
