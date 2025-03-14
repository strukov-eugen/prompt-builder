"use client"

import { useState, useCallback } from "react"
import type { Prompt, PaginationParams, FilterParams } from "@/types"
import { extendedMockPrompts } from "@/lib/mock-data"
import { addMockPrompt, updateMockPrompt } from "@/lib/mock-data-manager"

export function usePrompts() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPrompts = useCallback(
    async (
      { page = 1, limit = 10 }: PaginationParams,
      { search = "", tags = [], sortBy = "updatedAt", sortOrder = "desc" }: FilterParams = {},
    ): Promise<{ prompts: Prompt[]; total: number }> => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Real API implementation (commented out)
        /*
        const response = await serverManager.get<{ prompts: Prompt[]; total: number }>('/prompts', {
          page,
          limit,
          search,
          tags: tags.join(','),
          sortBy,
          sortOrder
        });
        return response;
        */

        // Filter prompts based on search and tags
        let filteredPrompts = [...extendedMockPrompts]

        if (search) {
          const searchLower = search.toLowerCase()
          filteredPrompts = filteredPrompts.filter(
            (prompt) =>
              prompt.name.toLowerCase().includes(searchLower) || prompt.content.toLowerCase().includes(searchLower),
          )
        }

        if (tags.length > 0) {
          filteredPrompts = filteredPrompts.filter((prompt) => prompt.tags.some((tag) => tags.includes(tag.id)))
        }

        // Sort prompts
        filteredPrompts.sort((a, b) => {
          const aValue = a[sortBy as keyof Prompt]
          const bValue = b[sortBy as keyof Prompt]

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          }

          return 0
        })

        // Paginate prompts
        const startIndex = (page - 1) * limit
        const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + limit)

        return {
          prompts: paginatedPrompts,
          total: filteredPrompts.length,
        }
      } catch (err) {
        setError("Failed to fetch prompts")
        return { prompts: [], total: 0 }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getPromptById = useCallback(async (id: string): Promise<Prompt | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Real API implementation (commented out)
      /*
      const prompt = await serverManager.get<Prompt>(`/prompts/${id}`);
      return prompt;
      */

      const prompt = extendedMockPrompts.find((p) => p.id === id) || null

      if (!prompt) {
        setError("Prompt not found")
        return null
      }

      return prompt
    } catch (err) {
      setError("Failed to fetch prompt")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createPrompt = useCallback(
    async (promptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Promise<Prompt | null> => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Real API implementation (commented out)
        /*
        const newPrompt = await serverManager.post<Prompt>('/prompts', promptData);
        return newPrompt;
        */

        // Create a new prompt with a unique ID
        const newPrompt: Prompt = {
          ...promptData,
          id: `new-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Add to mock data
        addMockPrompt(newPrompt)

        return newPrompt
      } catch (err) {
        setError("Failed to create prompt")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const updatePrompt = useCallback(async (id: string, promptData: Partial<Prompt>): Promise<Prompt | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Real API implementation (commented out)
      /*
      const updatedPrompt = await serverManager.put<Prompt>(`/prompts/${id}`, promptData);
      return updatedPrompt;
      */

      const updatedPrompt = updateMockPrompt(id, promptData)

      if (!updatedPrompt) {
        setError("Prompt not found")
        return null
      }

      return updatedPrompt
    } catch (err) {
      setError("Failed to update prompt")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deletePrompt = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Real API implementation (commented out)
      /*
      await serverManager.delete(`/prompts/${id}`);
      return true;
      */

      const promptIndex = extendedMockPrompts.findIndex((p) => p.id === id)

      if (promptIndex === -1) {
        setError("Prompt not found")
        return false
      }

      // In a real app, we would delete this on the server
      // For now, we'll just return success

      return true
    } catch (err) {
      setError("Failed to delete prompt")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    getPrompts,
    getPromptById,
    createPrompt,
    updatePrompt,
    deletePrompt,
  }
}

