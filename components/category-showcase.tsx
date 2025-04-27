"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

interface Category {
  name: string
  description: string
  image: string
  href: string
  unsplashImage?: string
  imageLink?: string
}

const categories: Category[] = [
  {
    name: "Sportswear",
    description: "Performance apparel for every sport",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=Sportswear",
    imageLink: "https://unsplash.com/s/photos/sportswear",
  },
  {
    name: "Footwear",
    description: "Specialized shoes for maximum performance",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=Footwear",
    imageLink: "https://unsplash.com/s/photos/athletic-shoes",
  },
  {
    name: "Equipment",
    description: "Professional gear for serious athletes",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=Equipment",
    imageLink: "https://unsplash.com/s/photos/sports-equipment",
  },
  {
    name: "Gym",
    description: "Everything you need for your home gym",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=Gym",
    imageLink: "https://unsplash.com/s/photos/gym-equipment",
  },
  {
    name: "Nutrition",
    description: "Supplements to fuel your performance",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=Nutrition",
    imageLink: "https://unsplash.com/s/photos/sports-nutrition",
  },
]

// Function to fetch images from Unsplash
const fetchUnsplashImages = async (query: string): Promise<string> => {
  try {
    // Use Unsplash source API which doesn't require authentication
    return `https://source.unsplash.com/featured/800x600?${encodeURIComponent(query + ",sports")}`
  } catch (error) {
    console.error("Error fetching Unsplash image:", error)
    return "/placeholder.svg?height=300&width=400" // Fallback to placeholder
  }
}

export default function CategoryShowcase() {
  const [categoriesWithImages, setCategoriesWithImages] = useState<Category[]>(categories)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUnsplashImages = async () => {
      setIsLoading(true)
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (category) => {
            const unsplashImage = await fetchUnsplashImages(category.name)
            return { ...category, unsplashImage }
          })
        )
        setCategoriesWithImages(updatedCategories)
      } catch (error) {
        console.error("Error loading Unsplash images:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUnsplashImages()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoriesWithImages.map((category) => (
        <div 
          key={category.name}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="aspect-[4/3] w-full relative">
            {/* Image with its own link */}
            <a 
              href={category.imageLink || category.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full"
              onClick={(e) => e.stopPropagation()} // Prevent triggering parent link
            >
              <Image
                src={category.unsplashImage || category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={!!category.unsplashImage} // Unoptimized for Unsplash dynamic URLs
                priority
              />
            </a>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                <span className="sr-only">Loading...</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <Link href={category.href} className="block">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-200 mb-2">{category.description}</p>
              <div className="flex items-center text-sm font-medium">
                Shop now <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
