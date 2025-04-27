import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/user"
import Product from "@/models/product"
import { enrichedProducts } from "@/data/enrichedProducts"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase()

    // Clear existing data
    await Product.deleteMany({})
    await User.deleteMany({})

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await User.create({
      name: "Admin User",
      email: "admin@sportas.com",
      password: hashedPassword,
      isAdmin: true,
    })

    // Create regular user
    await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
      isAdmin: false,
    })

    // Insert products
    await Product.insertMany(enrichedProducts)

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding database",
      },
      { status: 500 },
    )
  }
}
