"use client"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  email: string
  username: string
  role: "consumer" | "seller" | "admin"
}

type AuthContextType = {
  user: User | null
  login: (email: string, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (email: string, username: string) => {
    let role: "consumer" | "seller" | "admin" = "consumer"
    if (email === "chethanshetty1117@gmail.com") {
      role = "admin"
    } else if (email.endsWith("@seller.cskit.com")) {
      role = "seller"
    }
    const newUser = { email, username, role }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    // Store consumer names
    if (role === "consumer") {
      const consumers = JSON.parse(localStorage.getItem("consumers") || "[]")
      if (!consumers.includes(username)) {
        consumers.push(username)
        localStorage.setItem("consumers", JSON.stringify(consumers))
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

