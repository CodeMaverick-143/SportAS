"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserType } from "@/types"
import { loginUser, registerUser, getCurrentUser, logoutUser, updateUserProfile } from "@/lib/api"

interface AuthContextType {
  user: UserType | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (userData: {
    name?: string
    phone?: string
    address?: {
      line1?: string
      city?: string
      state?: string
      pincode?: string
    }
  }) => Promise<UserType>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Not authenticated", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password)
      setUser(userData)
    } catch (error) {
      console.error("Login failed", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerUser(name, email, password)
    } catch (error) {
      console.error("Registration failed", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Logout failed", error)
    }
  }
  
  const updateProfile = async (userData: {
    name?: string
    phone?: string
    address?: {
      line1?: string
      city?: string
      state?: string
      pincode?: string
    }
  }) => {
    try {
      const updatedUser = await updateUserProfile(userData)
      // Update the local user state with the new data from the server
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error("Profile update failed", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
