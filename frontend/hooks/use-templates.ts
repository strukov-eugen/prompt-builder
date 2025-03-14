"use client"

import { useState, useCallback } from "react"
import type { Template, PaginationParams, FilterParams } from "@/types"
import { mockTemplates } from "@/lib/mock-data"
import { addMockTemplate, updateMockTemplate } from "@/lib/mock-data-manager"

export function useTemplates() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTemplates = useCallback(
    async (
      { page = 1, limit = 10 }: PaginationParams,
      { search = "", sortBy = "updatedAt", sortOrder = "desc" }: FilterParams = {},
    ): Promise<{ templates: Template[]; total: number }> => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Real API implementation (commented out)
        /*
        const response = await serverManager.get<{ templates: Template[]; total: number }>('/templates', {
          page,
          limit,
          search,
          sortBy,
          sortOrder
        });
        return response;
        */

        // Filter templates based on search
        let filteredTemplates = [...mockTemplates]

        if (search) {
          const searchLower = search.toLowerCase()
          filteredTemplates = filteredTemplates.filter(
            (template) =>
              template.name.toLowerCase().includes(searchLower) ||
              (template.description && template.description.toLowerCase().includes(searchLower)),
          )
        }

        // Sort templates
        filteredTemplates.sort((a, b) => {
          const aValue = a[sortBy as keyof Template]
          const bValue = b[sortBy as keyof Template]

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          }

          return 0
        })

        // Paginate templates
        const startIndex = (page - 1) * limit
        const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + limit)

        return {
          templates: paginatedTemplates,
          total: filteredTemplates.length,
        }
      } catch (err) {
        setError("Failed to fetch templates")
        return { templates: [], total: 0 }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getTemplateById = useCallback(async (id: string): Promise<Template | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Real API implementation (commented out)
      /*
      const template = await serverManager.get<Template>(`/templates/${id}`);
      return template;
      */

      const template = mockTemplates.find((t) => t.id === id) || null

      if (!template) {
        setError("Template not found")
        return null
      }

      return template
    } catch (err) {
      setError("Failed to fetch template")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTemplate = useCallback(
    async (templateData: Omit<Template, "id" | "createdAt" | "updatedAt">): Promise<Template | null> => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Real API implementation (commented out)
        /*
        const newTemplate = await serverManager.post<Template>('/templates', templateData);
        return newTemplate;
        */

        // Create a new template with a unique ID
        const newTemplate: Template = {
          ...templateData,
          id: `new-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Add to mock data
        addMockTemplate(newTemplate)

        return newTemplate
      } catch (err) {
        setError("Failed to create template")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const updateTemplate = useCallback(async (id: string, templateData: Partial<Template>): Promise<Template | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Real API implementation (commented out)
      /*
      const updatedTemplate = await serverManager.put<Template>(`/templates/${id}`, templateData);
      return updatedTemplate;
      */

      const updatedTemplate = updateMockTemplate(id, templateData)

      if (!updatedTemplate) {
        setError("Template not found")
        return null
      }

      return updatedTemplate
    } catch (err) {
      setError("Failed to update template")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Real API implementation (commented out)
      /*
      await serverManager.delete(`/templates/${id}`);
      return true;
      */

      const templateIndex = mockTemplates.findIndex((t) => t.id === id)

      if (templateIndex === -1) {
        setError("Template not found")
        return false
      }

      // In a real app, we would delete this on the server
      // For now, we'll just return success

      return true
    } catch (err) {
      setError("Failed to delete template")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}

