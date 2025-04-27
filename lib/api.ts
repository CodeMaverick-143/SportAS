// Updated API service to use real API endpoints

import type { Product, Order, UserType } from "@/types"

// Authentication APIs
export async function loginUser(email: string, password: string): Promise<UserType> {
  try {
    console.log('Attempting login for:', email)
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      // Add credentials to ensure cookies are sent/received
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }))
      console.error('Login error:', errorData)
      throw new Error(errorData.message || `Login failed with status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.user) {
      throw new Error('Invalid user data received from server')
    }
    
    console.log('Login successful')
    return data.user
  } catch (error) {
    console.error('Login process error:', error)
    throw error
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<void> {
  try {
    console.log('Attempting registration for:', email)
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }))
      console.error('Registration error:', errorData)
      throw new Error(errorData.message || `Registration failed with status: ${response.status}`)
    }
    
    console.log('Registration successful')
  } catch (error) {
    console.error('Registration process error:', error)
    throw error
  }
}

export async function getCurrentUser(): Promise<UserType> {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated")
      }
      throw new Error(`Authentication check failed with status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.user) {
      throw new Error('Invalid user data received from server')
    }
    
    return data.user
  } catch (error) {
    console.error('getCurrentUser error:', error)
    throw error
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: 'include'
    })
    
    if (!response.ok) {
      console.warn(`Logout returned non-200 status: ${response.status}`)
    }
    
    console.log('Logout successful')
  } catch (error) {
    console.error('Logout error:', error)
    // Still consider logout successful even if server fails
    // as we want to clear local state
  }
}

// Product APIs
export async function getProducts(
  options: {
    search?: string
    categories?: string[]
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    featured?: boolean
    limit?: number
  } = {},
): Promise<Product[]> {
  // Build query string
  const params = new URLSearchParams()

  if (options.search) {
    params.append("search", options.search)
  }

  if (options.categories && options.categories.length > 0) {
    params.append("categories", options.categories.join(","))
  }

  if (options.minPrice !== undefined) {
    params.append("minPrice", options.minPrice.toString())
  }

  if (options.maxPrice !== undefined) {
    params.append("maxPrice", options.maxPrice.toString())
  }

  if (options.sortBy) {
    params.append("sortBy", options.sortBy)
  }

  if (options.featured) {
    params.append("featured", "true")
  }

  if (options.limit) {
    params.append("limit", options.limit.toString())
  }

  const response = await fetch(`/api/products?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`)

  if (!response.ok) {
    throw new Error("Product not found")
  }

  return response.json()
}

export async function getRelatedProducts(productId: string, category: string): Promise<Product[]> {
  const params = new URLSearchParams({
    categories: category,
    limit: "4",
  })

  const response = await fetch(`/api/products?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch related products")
  }

  const products = await response.json()
  return products.filter((p: Product) => p._id !== productId)
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    throw new Error("Failed to create product")
  }

  return response.json()
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    throw new Error("Failed to update product")
  }

  return response.json()
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
}

// Order APIs
export async function createOrder(orderData: any): Promise<Order> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error("Failed to create order")
  }

  return response.json()
}

export async function getOrders(options: { limit?: number; userId?: string } = {}): Promise<Order[]> {
  const params = new URLSearchParams()

  if (options.limit) {
    params.append("limit", options.limit.toString())
  }

  if (options.userId) {
    params.append("userId", options.userId)
  }

  const response = await fetch(`/api/orders?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await fetch(`/api/orders/${id}`)

  if (!response.ok) {
    throw new Error("Order not found")
  }

  return response.json()
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderStatus: status }),
  })

  if (!response.ok) {
    throw new Error("Failed to update order status")
  }

  return response.json()
}

// User APIs
export async function getUsers(options: { limit?: number } = {}): Promise<UserType[]> {
  const params = new URLSearchParams()

  if (options.limit) {
    params.append("limit", options.limit.toString())
  }

  const response = await fetch(`/api/users?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  const data = await response.json()
  return data.users
}

export async function updateUserProfile(userData: {
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}): Promise<UserType> {
  const response = await fetch("/api/users/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update profile")
  }

  const data = await response.json()
  return data.user
}

export async function saveShippingAddress(shippingData: {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}): Promise<void> {
  const response = await fetch("/api/users/save-address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shippingData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to save shipping address")
  }
}

export async function updateUserRole(id: string, makeAdmin: boolean): Promise<UserType> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isAdmin: makeAdmin }),
  })

  if (!response.ok) {
    throw new Error("Failed to update user role")
  }

  return response.json()
}

// Admin APIs
export async function getAdminStats(): Promise<{
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}> {
  const response = await fetch("/api/admin/stats")

  if (!response.ok) {
    throw new Error("Failed to fetch admin stats")
  }

  return response.json()
}
