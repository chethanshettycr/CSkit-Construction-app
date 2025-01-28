"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type Order = {
  id: string
  productName: string
  quantity: number
  status: string
  rating: number
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [tempRatings, setTempRatings] = useState<{ [key: string]: number }>({})
  const router = useRouter()

  const loadOrders = useCallback(() => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders)
      setOrders(parsedOrders)
      const initialTempRatings: { [key: string]: number } = {}
      parsedOrders.forEach((order: Order) => {
        initialTempRatings[order.id] = order.rating || 0
      })
      setTempRatings(initialTempRatings)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const updateTempRating = (orderId: string, rating: number) => {
    setTempRatings((prev) => ({ ...prev, [orderId]: rating }))
  }

  const submitRating = (orderId: string) => {
    const rating = tempRatings[orderId]
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, rating } : order))
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-foreground"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Orders
      </motion.h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Action</TableHead>
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
                  {order.status === "Delivered" && (
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 cursor-pointer ${
                            star <= (tempRatings[order.id] || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                          onClick={() => updateTempRating(order.id, star)}
                        />
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {order.status === "Delivered" && (
                    <Button onClick={() => submitRating(order.id)} disabled={tempRatings[order.id] === order.rating}>
                      Submit Rating
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button className="mt-4" variant="outline" onClick={() => router.push("/consumer")}>
        Back to Dashboard
      </Button>
    </motion.div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  )
}

