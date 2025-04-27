export interface Product {
  _id: string
  name: string
  description: string
  longDescription?: string
  price: number
  category: string
  imageUrl: string
  stock: number
  rating: number
  reviews: number
  discount: number
  featured: boolean
  specifications?: { name: string; value: string }[]
  createdAt: string
}

export interface UserType {
  _id: string
  name: string
  email: string
  password?: string
  phone?: string
  address?: {
    line1?: string
    city?: string
    state?: string
    pincode?: string
  }
  isAdmin: boolean
  createdAt: string
  orderCount?: number
}

export interface Order {
  _id: string
  userId: string
  items: {
    productId: string
    name: string
    price: number
    quantity: number
  }[]
  totalAmount: number
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
}
