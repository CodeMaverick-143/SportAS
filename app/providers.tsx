'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { CartProvider } from '@/context/cart-context'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // When rendering on the server, we don't want to apply any theme yet
  // This prevents the hydration mismatch
  if (!mounted) {
    return (
      <SessionProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
