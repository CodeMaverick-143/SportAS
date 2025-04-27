"use client"
import Link from "next/link"
import { MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Order } from "@/types"
import { updateOrderStatus } from "@/lib/api"

interface AdminOrdersTableProps {
  orders: Order[]
}

export default function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const { toast } = useToast()

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status)
      toast({
        title: "Order updated",
        description: "The order status has been updated successfully.",
      })
      // In a real app, you would refresh the orders list here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "processing":
        return "outline"
      case "shipped":
        return "secondary"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
              <TableCell>{order.shippingAddress.fullName}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Select
                  defaultValue={order.orderStatus}
                  onValueChange={(value) => handleStatusChange(order._id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue>
                      <Badge variant={getStatusBadgeVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order._id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
