"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        // For demo purposes, always set a demo user
        setUser({
          id: "user-1",
          name: "Demo User",
          email: "user@example.com",
        })

        // In a real app, you would validate the token with your backend
        const token =
          typeof window !== "undefined"
            ? sessionStorage.getItem("authToken") || localStorage.getItem("authToken")
            : null

        if (token) {
          try {
            const userData = JSON.parse(atob(token.split(".")[1]))
            setUser({
              id: userData.id || "user-1",
              name: userData.name || "Demo User",
              email: userData.email || "user@example.com",
            })
          } catch (parseError) {
            console.error("Failed to parse token:", parseError)
            // Keep the default user we set above
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would call your API here
      // For demo purposes, we'll just check if the email is "user@example.com" and password is "password"
      if (email === "user@example.com" && password === "password") {
        // Create a mock token
        const mockUser = {
          id: "user-1",
          name: "Demo User",
          email: email,
        }
        const token = `mock.${btoa(JSON.stringify(mockUser))}.token`

        // Store in both localStorage and sessionStorage for better compatibility
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token)
          sessionStorage.setItem("authToken", token)
        }

        setUser(mockUser)
        router.push("/prompts")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err) {
      console.error("Login failed:", err)
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would call your API here
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: `user-${Date.now()}`,
        name,
        email,
      }

      // Redirect to login page after successful registration
      router.push("/login?registered=true")
    } catch (err) {
      console.error("Registration failed:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      sessionStorage.removeItem("authToken")
    }
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
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

