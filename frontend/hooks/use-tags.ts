"use client"

import { useState, useCallback } from "react"
import type { Tag } from "@/types"
import { mockTags } from "@/lib/mock-data"

export function useTags() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTags = useCallback(async (): Promise<Tag[]> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Real API implementation (commented out)
      /*
      const tags = await serverManager.get<Tag[]>('/tags');
      return tags;
      */

      return [...mockTags]
    } catch (err) {
      setError("Failed to fetch tags")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTag = useCallback(async (name: string): Promise<Tag | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Real API implementation (commented out)
      /*
      const newTag = await serverManager.post<Tag>('/tags', { name });
      return newTag;
      */

      const newTag: Tag = {
        id: `new-${Date.now()}`,
        name,
      }

      // In a real app, we would add this to the server
      // For now, we'll just return the new tag

      return newTag
    } catch (err) {
      setError("Failed to create tag")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    getTags,
    createTag,
  }
}

