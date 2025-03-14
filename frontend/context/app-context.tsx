"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Prompt, Template, Tag } from "@/types"
import { usePrompts } from "@/hooks/use-prompts"
import { useTemplates } from "@/hooks/use-templates"
import { useTags } from "@/hooks/use-tags"

interface AppContextType {
  prompts: Prompt[]
  templates: Template[]
  tags: Tag[]
  isLoading: boolean
  error: string | null
  refreshPrompts: () => Promise<void>
  refreshTemplates: () => Promise<void>
  refreshTags: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const promptsApi = usePrompts()
  const templatesApi = useTemplates()
  const tagsApi = useTags()

  const refreshPrompts = async () => {
    setIsLoading(true)
    try {
      const result = await promptsApi.getPrompts({ page: 1, limit: 100 })
      setPrompts(result.prompts)
    } catch (err) {
      setError("Failed to fetch prompts")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTemplates = async () => {
    setIsLoading(true)
    try {
      const result = await templatesApi.getTemplates({ page: 1, limit: 100 })
      setTemplates(result.templates)
    } catch (err) {
      setError("Failed to fetch templates")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTags = async () => {
    setIsLoading(true)
    try {
      const fetchedTags = await tagsApi.getTags()
      setTags(fetchedTags)
    } catch (err) {
      setError("Failed to fetch tags")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshPrompts()
    refreshTemplates()
    refreshTags()
  }, [])

  return (
    <AppContext.Provider
      value={{
        prompts,
        templates,
        tags,
        isLoading,
        error,
        refreshPrompts,
        refreshTemplates,
        refreshTags,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

