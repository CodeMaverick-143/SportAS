import type { UserType } from "@/types"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Generate a random date within the last year
const generateDate = () => {
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime())
  return new Date(randomTime).toISOString()
}

// Sample users data
export const users: UserType[] = [
  {
    _id: generateId(),
    name: "Admin User",
    email: "admin@sportas.com",
    password: "admin123",
    isAdmin: true,
    createdAt: generateDate(),
    orderCount: 5,
  },
  {
    _id: generateId(),
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    isAdmin: false,
    createdAt: generateDate(),
    orderCount: 8,
  },
  {
    _id: generateId(),
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    isAdmin: false,
    createdAt: generateDate(),
    orderCount: 3,
  },
  {
    _id: generateId(),
    name: "Rahul Kumar",
    email: "rahul@example.com",
    password: "password123",
    isAdmin: false,
    createdAt: generateDate(),
    orderCount: 12,
  },
  {
    _id: generateId(),
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    isAdmin: false,
    createdAt: generateDate(),
    orderCount: 6,
  },
  {
    _id: generateId(),
    name: "Amit Patel",
    email: "amit@example.com",
    password: "password123",
    isAdmin: false,
    createdAt: generateDate(),
    orderCount: 0,
  },
]
