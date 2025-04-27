import type { Order } from "@/types"
import { users } from "./users"
import { products } from "./products"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Generate a random date within the last 3 months
const generateDate = () => {
  const now = new Date()
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  const randomTime = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  return new Date(randomTime).toISOString()
}
export const orders: Order[] = [
  {
    _id: generateId(),
    userId: users[1]._id,
    items: [
      {
        productId: products[0]._id,
        name: products[0].name,
        price: products[0].price,
        quantity: 2,
      },
      {
        productId: products[5]._id,
        name: products[5].name,
        price: products[5].price,
        quantity: 1,
      },
    ],
    totalAmount: products[0].price * 2 + products[5].price,
    shippingAddress: {
      fullName: "Code Maverick",
      email: "CodeMaverick@example.com",
      phone: "9876543210",
      address: "Your Space",
      city: "Pune",
      state: "Maharashtra",
      pincode: "400001",
    },
    paymentMethod: "card",
    paymentStatus: "completed",
    orderStatus: "delivered",
    createdAt: generateDate(),
  },
  {
    _id: generateId(),
    userId: users[2]._id,
    items: [
      {
        productId: products[1]._id,
        name: products[1].name,
        price: products[1].price,
        quantity: 1,
      },
    ],
    totalAmount: products[1].price,
    shippingAddress: {
      fullName: "Arpit Sarang",
      email: "ArpitSarang@example.com",
      phone: "8765432109",
      address: "ADYPU",
      city: "Pune",
      state: "Maharashtra",
      pincode: "400001",
    },
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "processing",
    createdAt: generateDate(),
  }
]