import axios, { type AxiosInstance } from "axios"
import { decodeToken } from "@/utils/decode-token"

// Use the environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export class ServerManager {
  private static instance: ServerManager
  protected apiClient: AxiosInstance
  private token: string | null = null
  private baseApiUrl: string = API_URL
  public senderId: string | null = null

  private constructor() {
    // Initialize Axios
    this.apiClient = axios.create({
      baseURL: this.baseApiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  public static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager()
    }
    return ServerManager.instance
  }

  // Token refresh method
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken")

      const response = await this.apiClient.post<{ accessToken: string }>(`${this.baseApiUrl}/auth/refresh-token`, {
        token: refreshToken,
      })

      const newToken = response.data.accessToken
      if (newToken) {
        this.setToken(newToken)
        return newToken
      }
    } catch (error) {
      console.error("Failed to refresh token:", error)
      this.logout()
    }

    return null
  }

  // Set token
  public setToken(token: string, refreshToken: string | null = null): void {
    this.token = token

    this.senderId = decodeToken(this.token as string)?.userId || ""

    sessionStorage.setItem("authToken", token)
    if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken)

    this.apiClient.defaults.headers.Authorization = `Bearer ${token}`
  }

  public getToken(): string | null {
    if (!this.token) {
      const authToken = sessionStorage.getItem("authToken")
      if (authToken) this.setToken(authToken)
    }
    return this.token || sessionStorage.getItem("authToken")
  }

  // API requests
  public async get<T>(url: string, params?: Record<string, any>): Promise<any> {
    try {
      const response = await this.apiClient.get<T>(url, { params })
      return response.data
    } catch (error) {
      return await this.handleError(error, async () => await this.apiClient.get<T>(url, params))
    }
  }

  public async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.apiClient.post<T>(url, data)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  public async put<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.apiClient.put<T>(url, data)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  public async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.apiClient.delete<T>(url)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  // Remove token and logout
  public logout(): void {
    this.token = null
    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("refreshToken")
    window.location.href = "/login"
  }

  // Error handler with token refresh attempt
  private async handleError(error: any, originalRequest?: () => Promise<any>): Promise<void> {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || error.message

      // Check for invalid token
      if (errorMessage === "Token is not valid") {
        console.warn("Token is invalid. Trying to refresh...")

        const newToken = await this.refreshToken()
        if (newToken && originalRequest) {
          try {
            console.log("Retrying original request...")
            return await originalRequest()
          } catch (retryError) {
            console.error("Retry failed:", retryError)
            this.logout()
          }
        }
      }
    }

    console.error("Unexpected Error:", error)
    throw error
  }
}

const serverManager = ServerManager.getInstance()
export default serverManager

