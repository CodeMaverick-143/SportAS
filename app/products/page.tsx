"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import ProductCard from "@/components/product-card"
import type { Product } from "@/types"
import { getProducts } from "@/lib/api"

const categories = ["Sportswear", "Footwear", "Equipment", "Gym", "Nutrition"]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : [])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await getProducts({
          search: searchQuery,
          categories: selectedCategories,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy,
        })
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, selectedCategories, priceRange, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already handled by the useEffect
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setPriceRange([0, 10000])
    setSortBy("featured")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our collection of high-quality sports products</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 sm:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down products by applying filters</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </p>
                  </div>
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    Reset Filters
                  </Button>
                  <Button onClick={() => setFiltersOpen(false)} className="bg-emerald-600 hover:bg-emerald-700">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filters */}
      {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map((category) => (
            <div key={category} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              {category}
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleCategoryChange(category, false)}
              >
                &times;
              </button>
            </div>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 10000) && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              ₹{priceRange[0]} - ₹{priceRange[1]}
              <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={() => setPriceRange([0, 10000])}>
                &times;
              </button>
            </div>
          )}
          <button className="text-sm text-emerald-600 hover:text-emerald-700 ml-2" onClick={handleReset}>
            Clear all
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={handleReset}>Reset Filters</Button>
        </div>
      )}
    </div>
  )
}
