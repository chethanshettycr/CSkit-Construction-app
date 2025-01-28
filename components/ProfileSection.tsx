"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/lib/auth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

type Order = {
  id: string
  productName: string
  quantity: number
  status: string
  rating: number
}

export default function ProfileSection() {
  const { user, login } = useAuth()
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      login(email, username)
      console.log("Profile updated:", { username, email, phone })
    }
  }

  const updateOrderRating = (orderId: string, rating: number) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, rating } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.map((order) => (
            <div key={order.id} className="mb-4">
              <p className="font-semibold">{order.productName}</p>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= (order.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                    onClick={() => updateOrderRating(order.id, star)}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

