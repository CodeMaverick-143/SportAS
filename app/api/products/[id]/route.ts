import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/models/product"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToDatabase()

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToDatabase()

    const productData = await request.json()

    const product = await Product.findByIdAndUpdate(params.id, productData, { new: true, runValidators: true })

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ success: false, message: "Error updating product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToDatabase()

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, message: "Error deleting product" }, { status: 500 })
  }
}
