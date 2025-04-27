"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { Edit, Mail, Phone, MapPin, User as UserIcon, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { getOrders } from "@/lib/api"
import Link from "next/link"
import type { Order } from "@/types"

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    // If user is not logged in and not loading, redirect to login
    if (!loading && !user) {
      redirect("/login?redirect=profile")
    }

    // Populate the profile data from user data
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.line1 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      })

      // Fetch user orders
      const fetchOrders = async () => {
        setLoadingOrders(true)
        try {
          const userOrders = await getOrders({ userId: user._id })
          setOrders(userOrders)
        } catch (error) {
          console.error("Error fetching orders:", error)
        } finally {
          setLoadingOrders(false)
        }
      }

      fetchOrders()
    }
  }, [user, loading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Create the update payload
      const userData = {
        name: profileData.name,
        phone: profileData.phone,
        address: {
          line1: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode
        }
      }
      
      // Call the auth context to update the user profile
      // This will update both database and local state
      await updateProfile(userData)
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal information and address</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input 
                            id="name" 
                            name="name" 
                            value={profileData.name} 
                            onChange={handleChange} 
                            required 
                          />
                        ) : (
                          <div className="flex items-center gap-2 border rounded-md p-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span>{profileData.name || "Not provided"}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={profileData.email} 
                            onChange={handleChange}
                            required 
                            disabled
                          />
                        ) : (
                          <div className="flex items-center gap-2 border rounded-md p-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{profileData.email || "Not provided"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={profileData.phone} 
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                        />
                      ) : (
                        <div className="flex items-center gap-2 border rounded-md p-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{profileData.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input 
                          id="address" 
                          name="address" 
                          value={profileData.address} 
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 border rounded-md p-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{profileData.address || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        {isEditing ? (
                          <Input 
                            id="city" 
                            name="city" 
                            value={profileData.city} 
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="border rounded-md p-2">
                            {profileData.city || "Not provided"}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {isEditing ? (
                          <Input 
                            id="state" 
                            name="state" 
                            value={profileData.state} 
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="border rounded-md p-2">
                            {profileData.state || "Not provided"}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        {isEditing ? (
                          <Input 
                            id="pincode" 
                            name="pincode" 
                            value={profileData.pincode} 
                            onChange={handleChange}
                            placeholder="6-digit PIN code"
                          />
                        ) : (
                          <div className="border rounded-md p-2">
                            {profileData.pincode || "Not provided"}
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <Button 
                        type="submit" 
                        className="mt-4 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" 
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500">Name</h3>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Email</h3>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Account Status</h3>
                  <Badge variant="outline" className="mt-1">Active</Badge>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Member Since</h3>
                  <p className="font-medium">April 2025</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/orders"}>
                  View Order History
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View all your past orders and track their status</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <p className="text-center py-8">Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <span className="text-sm text-gray-500">Order #</span>
                          <span className="font-medium ml-1">{order._id.substring(0, 8)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Date:</span>
                          <span className="font-medium ml-1">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Total:</span>
                          <span className="font-medium ml-1">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div>
                          <Badge
                            variant={
                              order.orderStatus === "delivered"
                                ? "default"
                                : order.orderStatus === "cancelled"
                                ? "destructive"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {order.orderStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium mb-2">Items</h4>
                        <ul className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <li key={item.productId} className="flex justify-between">
                              <span>
                                {item.name} <span className="text-gray-500">x{item.quantity}</span>
                              </span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-end">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 border-emerald-600"
                          >
                            <Link href={`/orders/${order._id}`} className="flex items-center gap-1">
                              View Details <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
