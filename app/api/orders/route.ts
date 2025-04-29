// app/api/order/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Order from "@/models/order"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const filter: any = {};
    if (userId) filter.userId = userId;
    const orders = await Order.find(filter);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const orderData = await request.json()

    // Validate required fields
    const errors: string[] = []

    if (!orderData?.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      errors.push("Invalid or missing items array")
    }

    if (typeof orderData.totalAmount !== "number" || isNaN(orderData.totalAmount)) {
      errors.push("Invalid or missing totalAmount")
    }

    const shipping = orderData?.shippingAddress
    if (
      !shipping ||
      typeof shipping !== "object" ||
      !shipping.fullName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.state ||
      !shipping.pincode ||
      !shipping.phone
    ) {
      errors.push("Incomplete or missing shippingAddress")
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: `Validation failed: ${errors.join(", ")}` },
        { status: 400 }
      )
    }

    // Save order to DB
    const newOrder = await Order.create(orderData)

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 })

  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { success: false, message: "Server error: " + (error as any)?.message },
      { status: 500 }
    )
  }
}
