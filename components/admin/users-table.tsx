"use client"

import { useState } from "react"
import { MoreHorizontal, Shield, ShieldOff } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { UserType } from "@/types"
import { updateUserRole } from "@/lib/api"

interface AdminUsersTableProps {
  users: UserType[]
}

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ id: string; makeAdmin: boolean } | null>(null)
  const { toast } = useToast()

  const handleRoleChange = (userId: string, makeAdmin: boolean) => {
    setSelectedUser({ id: userId, makeAdmin })
    setConfirmDialogOpen(true)
  }

  const handleConfirmRoleChange = async () => {
    if (!selectedUser) return

    try {
      await updateUserRole(selectedUser.id, selectedUser.makeAdmin)
      toast({
        title: "User role updated",
        description: `User is now ${selectedUser.makeAdmin ? "an admin" : "a regular user"}.`,
      })
      // In a real app, you would refresh the users list here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConfirmDialogOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={user.isAdmin ? "default" : "outline"}>{user.isAdmin ? "Admin" : "User"}</Badge>
                </TableCell>
                <TableCell>{user.orderCount || 0}</TableCell>
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
                      {user.isAdmin ? (
                        <DropdownMenuItem onClick={() => handleRoleChange(user._id, false)}>
                          <ShieldOff className="mr-2 h-4 w-4" /> Remove Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleRoleChange(user._id, true)}>
                          <Shield className="mr-2 h-4 w-4" /> Make Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.makeAdmin
                ? "This will grant admin privileges to this user. They will have access to the admin dashboard and all management features."
                : "This will remove admin privileges from this user. They will no longer have access to the admin dashboard."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRoleChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
