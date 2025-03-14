"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { usePrompts } from "@/hooks/use-prompts"
import { useTemplates } from "@/hooks/use-templates"
import { useAuth } from "@/context/auth-context"
import type { Prompt, Template } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SortablePromptItem } from "@/components/sortable-prompt-item"
import { ArrowLeft, Plus, Save, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function EditTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  const isNewTemplate = templateId === "new"

  const [template, setTemplate] = useState<Template | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [promptItems, setPromptItems] = useState<{ id: string; promptId: string; order: number }[]>([])
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(!isNewTemplate)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const templatesApi = useTemplates()
  const promptsApi = usePrompts()
  const { user } = useAuth()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && typeof window !== "undefined") {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname))
      return
    }

    const fetchData = async () => {
      try {
        // Fetch available prompts
        const result = await promptsApi.getPrompts({ page: 1, limit: 100 })
        setAvailablePrompts(result.prompts)

        if (!isNewTemplate) {
          // Fetch template
          const fetchedTemplate = await templatesApi.getTemplateById(templateId)
          if (fetchedTemplate) {
            setTemplate(fetchedTemplate)
            setName(fetchedTemplate.name)
            setDescription(fetchedTemplate.description || "")
            setPromptItems(fetchedTemplate.prompts)
          } else {
            router.push("/templates")
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setError("Failed to load data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [templateId, isNewTemplate, router, user])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setPromptItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index + 1,
        }))
      })
    }
  }

  // Fix the handleAddPrompt function to remove the duplicate code and fix the order property
  const handleAddPrompt = (promptId: string) => {
    // Check if prompt is already in the list
    if (promptItems.some((item) => item.promptId === promptId)) {
      setError("This prompt is already in the template")
      setTimeout(() => setError(null), 3000)
      return
    }

    const newItem = {
      id: `item-${Date.now()}`,
      promptId,
      order: promptItems.length + 1,
    }

    setPromptItems([...promptItems, newItem])
  }

  const handleRemovePrompt = (itemId: string) => {
    setPromptItems(
      promptItems
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({
          ...item,
          order: index + 1,
        })),
    )
  }

  // Update the handleSave function to properly handle the result and redirection
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Template name is required")
      setTimeout(() => setError(null), 3000)
      return
    }

    if (promptItems.length === 0) {
      setError("Please add at least one prompt to the template")
      setTimeout(() => setError(null), 3000)
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const templateData = {
        name: name.trim(),
        description: description.trim(),
        prompts: promptItems,
      }

      let result

      if (isNewTemplate) {
        result = await templatesApi.createTemplate(templateData)
      } else {
        result = await templatesApi.updateTemplate(templateId, templateData)
      }

      if (result) {
        // Use router.push with a slight delay to ensure state is updated
        setTimeout(() => {
          router.push(`/templates/${result.id}`)
        }, 100)
      } else {
        throw new Error("Failed to save template")
      }
    } catch (error) {
      console.error("Failed to save template:", error)
      setError("Failed to save template. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredPrompts = availablePrompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" asChild>
            <Link href={isNewTemplate ? "/templates" : `/templates/${templateId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{isNewTemplate ? "Create New Template" : "Edit Template"}</h1>
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Template"}
        </Button>
      </div>

      {error && (
        <Alert className="mb-6 bg-destructive/15 text-destructive border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Enter the name and description of your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter template name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter template description..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Prompt Sequence</h3>

                {promptItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md text-center">
                    <p className="text-muted-foreground mb-4">No prompts added to this template yet.</p>
                    <p className="text-sm text-muted-foreground">Add prompts from the list on the right.</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext items={promptItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {promptItems.map((item) => {
                          const prompt = availablePrompts.find((p) => p.id === item.promptId)
                          return prompt ? (
                            <SortablePromptItem
                              key={item.id}
                              id={item.id}
                              prompt={prompt}
                              onRemove={() => handleRemovePrompt(item.id)}
                            />
                          ) : null
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Available Prompts</CardTitle>
              <CardDescription>Add prompts to your template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredPrompts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No prompts found. Try a different search term.
                  </p>
                ) : (
                  filteredPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-accent transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{prompt.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {prompt.content.substring(0, 50)}...
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleAddPrompt(prompt.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

