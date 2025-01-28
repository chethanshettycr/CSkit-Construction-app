"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/lib/auth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: "consumer" | "seller"
}

type Order = {
  id: string
  consumerId: string
  sellerId: string
  productName: string
  quantity: number
  status: string
  rating: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalConsumers: 0,
    totalLogins: 0,
    averageRating: 0,
  })

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("users")
      const storedOrders = localStorage.getItem("orders")
      const storedConsumers = localStorage.getItem("consumers")
      const storedLogins = localStorage.getItem("logins")

      if (storedUsers) setUsers(JSON.parse(storedUsers))
      if (storedOrders) setOrders(JSON.parse(storedOrders))

      // Update stats
      const parsedOrders = storedOrders ? JSON.parse(storedOrders) : []
      const totalRatings = parsedOrders.reduce((sum: number, order: Order) => sum + (order.rating || 0), 0)
      const averageRating = parsedOrders.length > 0 ? totalRatings / parsedOrders.length : 0

      setStats({
        totalUsers: storedUsers ? JSON.parse(storedUsers).length : 0,
        totalOrders: parsedOrders.length,
        totalConsumers: storedConsumers ? JSON.parse(storedConsumers).length : 0,
        totalLogins: storedLogins ? Number.parseInt(storedLogins) : 0,
        averageRating: Number(averageRating.toFixed(2)),
      })
    } catch (error) {
      console.error("Error parsing data from localStorage:", error)
    }
  }, [])

  const approveSeller = (userId: string) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, role: "seller" as const } : u))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-2xl font-bold text-foreground"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to CSkit Admin Dashboard, {user?.username}
        </motion.h1>
        <Button variant="outline" onClick={() => router.push("/profile")}>
          Profile
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.averageRating}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.role === "consumer" && (
                    <Button onClick={() => approveSeller(user.id)}>Approve as Seller</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.section>

      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Orders and Ratings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {order.rating ? (
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= order.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    "Not rated"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.section>
    </motion.div>
  )
}

