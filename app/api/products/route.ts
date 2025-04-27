import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/models/product"

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const search = searchParams.get("search") || ""
    const categories = searchParams.get("categories")?.split(",") || []
    const minPrice = Number(searchParams.get("minPrice")) || 0
    const maxPrice = Number(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER
    const featured = searchParams.get("featured") === "true"
    const limit = Number(searchParams.get("limit")) || 0
    const sortBy = searchParams.get("sortBy") || "featured"

    // Build query
    const query: any = {
      price: { $gte: minPrice, $lte: maxPrice },
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (categories.length > 0) {
      query.category = { $in: categories }
    }

    if (featured) {
      query.featured = true
    }

    // Execute query with sorting
    let productsQuery = Product.find(query)

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        productsQuery = productsQuery.sort({ price: 1 })
        break
      case "price-desc":
        productsQuery = productsQuery.sort({ price: -1 })
        break
      case "newest":
        productsQuery = productsQuery.sort({ createdAt: -1 })
        break
      default:
        productsQuery = productsQuery.sort({ featured: -1 })
    }

    // Apply limit
    if (limit > 0) {
      productsQuery = productsQuery.limit(limit)
    }

    const products = await productsQuery.exec()

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, message: "Error fetching products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase()

    const productData = await request.json()

    // Create new product
    const product = await Product.create(productData)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, message: "Error creating product" }, { status: 500 })
  }
}
