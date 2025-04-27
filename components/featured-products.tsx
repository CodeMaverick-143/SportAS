"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/types"
import { getProducts } from "@/lib/api"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ featured: true, limit: 8 })
        
        // Ensure all products have valid image URLs
        const enhancedData = data.map(product => ({
          ...product,
          // Use existing imageUrl or fallback to category-specific Unsplash image
          imageUrl: product.imageUrl || getDefaultImageForCategory(product.category)
        }))
        
        setProducts(enhancedData)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])
  
  // Function to get default category images if product images are missing
  const getDefaultImageForCategory = (category: string): string => {
    const categoryImages: Record<string, string> = {
      'Sportswear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'Footwear': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
      'Equipment': 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
      'Gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      'Nutrition': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d'
    }
    
    return categoryImages[category] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card key={product._id} className="overflow-hidden group rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Link href={`/product/${product._id}`} className="relative block aspect-square overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={index < 4} // Prioritize loading the first 4 images
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {product.discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white font-medium">{product.discount}% OFF</Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-2 left-2 bg-amber-500 text-white font-medium">Low Stock</Badge>
            )}
          </Link>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/product/${product._id}`} className="font-medium hover:underline text-gray-900 line-clamp-1">
                {product.name}
              </Link>
              <Badge variant="outline" className="text-xs flex-shrink-0 ml-1">
                {product.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-700">₹{product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{Math.round((product.price * 100) / (100 - product.discount)).toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={() => addToCart(product)} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all hover:shadow"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
