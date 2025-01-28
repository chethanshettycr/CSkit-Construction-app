"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/lib/auth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
}

type Order = {
  id: string
  productName: string
  quantity: number
  status: string
  reviewed: boolean
}

export default function ConsumerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("products")
      if (storedProducts) {
        setAllProducts(JSON.parse(storedProducts))
      } else {
        // If no products in local storage, use default products
        const defaultProducts: Product[] = [
          {
            id: 1,
            name: "Cement",
            price: 350,
            image:
              "https://images.unsplash.com/photo-1560435650-7ec2e17ba926?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "High-quality cement for construction projects.",
          },
          {
            id: 2,
            name: "Bricks",
            price: 10,
            image:
              "https://plus.unsplash.com/premium_photo-1675103339078-88b54e155e71?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Durable bricks for building sturdy structures.",
          },
          {
            id: 3,
            name: "Steel",
            price: 500,
            image:
              "https://images.unsplash.com/photo-1582540730843-f4418d96ccbe?q=80&w=1892&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "High-strength steel for reinforcement and structural support.",
          },
          {
            id: 4,
            name: "Sand",
            price: 200,
            image:
              "https://plus.unsplash.com/premium_photo-1680658496041-f7575066cec2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Fine-grade sand for various construction applications.",
          },
          {
            id: 5,
            name: "Gravel",
            price: 250,
            image:
              "https://plus.unsplash.com/premium_photo-1675543163354-e4dc1f541330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Assorted gravel for landscaping and construction projects.",
          },
          {
            id: 6,
            name: "Wooden Planks",
            price: 400,
            image:
              "https://images.unsplash.com/photo-1591195853095-f1681b00e29c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "High-quality wooden planks for various construction needs.",
          },
        ]
        setAllProducts(defaultProducts)
        localStorage.setItem("products", JSON.stringify(defaultProducts))
      }

      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        setCart(parsedCart)
        setCartCount(parsedCart.length)
      }

      const storedOrders = localStorage.getItem("orders")
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product]
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      return updatedCart
    })
    setCartCount((prevCount) => prevCount + 1)
    setSelectedProduct(null) // Close the product dialog
  }

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product)
  }

  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-2xl font-bold text-foreground"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to CSkit Consumer App, {user?.username}
        </motion.h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Profile
          </Button>
          <Button variant="outline" onClick={() => router.push("/orders")}>
            Orders
          </Button>
          <Button variant="outline" className="relative" onClick={() => router.push("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
      <motion.div className="mb-6" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Label htmlFor="search" className="text-foreground">
          Search Products
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background text-foreground"
        />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="bg-card cursor-pointer" onClick={() => openProductDialog(product)}>
              <CardHeader>
                <CardTitle className="text-card-foreground">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded-md"
                />
                <p className="text-lg font-bold text-card-foreground">₹{product.price}</p>
              </CardContent>
              <CardFooter>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isInCart(product.id)) {
                        router.push("/cart")
                      } else {
                        addToCart(product)
                      }
                    }}
                  >
                    {isInCart(product.id) ? (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <img
              src={selectedProduct.image || "/placeholder.svg"}
              alt={selectedProduct.name}
              className="w-full h-60 object-cover mb-4 rounded-md"
            />
            <DialogDescription>
              <p className="text-lg font-bold mb-2">₹{selectedProduct.price}</p>
              <p className="mb-4">{selectedProduct.description}</p>
            </DialogDescription>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (isInCart(selectedProduct.id)) {
                  router.push("/cart")
                } else {
                  addToCart(selectedProduct)
                }
              }}
            >
              {isInCart(selectedProduct.id) ? "View Cart" : "Add to Cart"}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}

