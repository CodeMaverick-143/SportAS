"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, LogIn, Package, Home, Dumbbell, ShoppingBag, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  { name: "Sportswear", href: "/products?category=Sportswear", icon: ShoppingBag },
  { name: "Footwear", href: "/products?category=Footwear", icon: ShoppingBag },
  { name: "Equipment", href: "/products?category=Equipment", icon: Package },
  { name: "Gym", href: "/products?category=Gym", icon: Dumbbell },
  { name: "Nutrition", href: "/products?category=Nutrition", icon: Utensils },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { cartItems } = useCart()

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-emerald-600">
          SportAs
        </Link>

        <nav className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              pathname === "/" ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="link" 
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${pathname.startsWith('/products') && pathname.includes('category=') ? 'text-emerald-600' : 'text-muted-foreground'}`}
              >
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Shop by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem key={category.name} asChild>
                  <Link 
                    href={category.href} 
                    className="flex items-center w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link 
                  href="/products" 
                  className="flex items-center font-medium text-emerald-600"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View All Products
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/products"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              pathname === "/products" ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            All Products
          </Link>

          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              pathname === "/about" ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              pathname === "/contact" ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>

                <div className="space-y-2">
                  <p className="text-base font-medium text-emerald-600">Shop by Category</p>
                  <div className="border rounded-md p-2 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className={`flex items-center gap-2 py-2 px-2 text-sm rounded-md ${pathname.includes(`category=${category.name}`) ? 'bg-emerald-50 text-emerald-600 font-medium' : 'hover:bg-gray-50'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <category.icon className="h-4 w-4" />
                        {category.name}
                      </Link>
                    ))}
                    <div className="my-1 border-t" />
                    <Link
                      href="/products"
                      className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-emerald-600 rounded-md hover:bg-emerald-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      View All Products
                    </Link>
                  </div>
                </div>

                <Link
                  href="/products"
                  className="flex items-center gap-2 py-1 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  All Products
                </Link>

                <Link href="/about" className="flex items-center gap-2 py-1 text-sm" onClick={() => setIsOpen(false)}>
                  About
                </Link>

                <Link href="/contact" className="flex items-center gap-2 py-1 text-sm" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 py-1 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 py-1 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 py-1 text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start px-2"
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 py-1 text-sm" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
