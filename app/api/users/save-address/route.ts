import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, address, city, state, pincode } = body;

    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Here, you would update the user's address in the database.
    // For now, just return success (implement user lookup as needed)
    return NextResponse.json({ message: "Shipping address saved successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error saving address" }, { status: 500 });
  }
}
