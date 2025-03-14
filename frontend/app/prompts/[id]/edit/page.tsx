"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { usePrompts } from "@/hooks/use-prompts"
import { useTags } from "@/hooks/use-tags"
import type { Prompt, Tag, Variable } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { extractVariablesFromContent } from "@/lib/utils"
import { ArrowLeft, Plus, Save, Trash, X } from "lucide-react"

export default function EditPromptPage() {
  const params = useParams()
  const router = useRouter()
  const promptId = params.id as string
  const isNewPrompt = promptId === "new"

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [variables, setVariables] = useState<Variable[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(!isNewPrompt)
  const [isSaving, setIsSaving] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newVariableName, setNewVariableName] = useState("")
  const [newVariableDescription, setNewVariableDescription] = useState("")

  const promptsApi = usePrompts()
  const tagsApi = useTags()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tags
        const fetchedTags = await tagsApi.getTags()
        setAvailableTags(fetchedTags)

        if (!isNewPrompt) {
          // Fetch prompt
          const fetchedPrompt = await promptsApi.getPromptById(promptId)
          if (fetchedPrompt) {
            setPrompt(fetchedPrompt)
            setName(fetchedPrompt.name)
            setContent(fetchedPrompt.content)
            setSelectedTags(fetchedPrompt.tags)
            setVariables(fetchedPrompt.variables)
          } else {
            router.push("/prompts")
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [promptId, isNewPrompt, router])

  const handleContentChange = (value: string) => {
    setContent(value)

    // Extract variables from content
    const extractedVariableNames = extractVariablesFromContent(value)

    // Keep existing variables that are still in the content
    const existingVariables = variables.filter((v) => extractedVariableNames.includes(v.name))

    // Add new variables
    const newVariables = extractedVariableNames
      .filter((name) => !variables.some((v) => v.name === name))
      .map((name) => ({
        id: `new-${Date.now()}-${name}`,
        name,
        description: "",
      }))

    setVariables([...existingVariables, ...newVariables])
  }

  const handleTagSelect = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId)
    if (tag && !selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId))
  }

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return

    try {
      const newTag = await tagsApi.createTag(newTagName.trim())
      if (newTag) {
        setAvailableTags([...availableTags, newTag])
        setSelectedTags([...selectedTags, newTag])
        setNewTagName("")
      }
    } catch (error) {
      console.error("Failed to create tag:", error)
    }
  }

  const handleUpdateVariableDescription = (id: string, description: string) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, description } : v)))
  }

  const handleAddNewVariable = () => {
    if (!newVariableName.trim()) return

    const newVariable: Variable = {
      id: `new-${Date.now()}`,
      name: newVariableName.trim(),
      description: newVariableDescription.trim(),
    }

    setVariables([...variables, newVariable])
    setNewVariableName("")
    setNewVariableDescription("")

    // Add the variable to the content
    setContent(content + ` {{ ${newVariableName.trim()} }}`)
  }

  const handleRemoveVariable = (id: string) => {
    const variableToRemove = variables.find((v) => v.id === id)
    if (!variableToRemove) return

    // Remove variable from content
    const regex = new RegExp(`\\{\\{\\s*${variableToRemove.name}\\s*\\}\\}`, "g")
    const updatedContent = content.replace(regex, "")

    setContent(updatedContent)
    setVariables(variables.filter((v) => v.id !== id))
  }

  // Update the handleSave function to properly handle the result and redirection
  const handleSave = async () => {
    if (!name.trim() || !content.trim()) {
      alert("Name and content are required")
      return
    }

    setIsSaving(true)

    try {
      const promptData = {
        name: name.trim(),
        content: content.trim(),
        tags: selectedTags,
        variables,
      }

      let result

      if (isNewPrompt) {
        result = await promptsApi.createPrompt(promptData)
      } else {
        result = await promptsApi.updatePrompt(promptId, promptData)
      }

      if (result) {
        // Use router.push with a slight delay to ensure state is updated
        setTimeout(() => {
          router.push(`/prompts/${result.id}`)
        }, 100)
      } else {
        throw new Error("Failed to save prompt")
      }
    } catch (error) {
      console.error("Failed to save prompt:", error)
      alert("Failed to save prompt")
    } finally {
      setIsSaving(false)
    }
  }

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
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
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
            <Link href={isNewPrompt ? "/prompts" : `/prompts/${promptId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{isNewPrompt ? "Create New Prompt" : "Edit Prompt"}</h1>
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Prompt"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Details</CardTitle>
              <CardDescription>Enter the name and content of your prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter prompt name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Enter prompt content... Use {'{{ variable_name }}'} for variables."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{{ variable_name }}"} syntax to define variables in your prompt.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to categorize your prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name..."
                  className="flex-1"
                />
                <Button onClick={handleAddNewTag} disabled={!newTagName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Select onValueChange={handleTagSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter((tag) => !selectedTags.some((t) => t.id === tag.id))
                    .map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedTags.length === 0 && <p className="text-sm text-muted-foreground">No tags selected</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variables</CardTitle>
              <CardDescription>Variables detected in your prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                    placeholder="Variable name..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddNewVariable} disabled={!newVariableName.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  value={newVariableDescription}
                  onChange={(e) => setNewVariableDescription(e.target.value)}
                  placeholder="Variable description (optional)..."
                />

                {variables.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {variables.map((variable) => (
                      <div key={variable.id} className="flex items-start gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="font-medium">{variable.name}</div>
                          <Input
                            value={variable.description || ""}
                            onChange={(e) => handleUpdateVariableDescription(variable.id, e.target.value)}
                            placeholder="Description (optional)..."
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveVariable(variable.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">
                    No variables detected. Use {"{{ variable_name }}"} syntax in your prompt content.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

