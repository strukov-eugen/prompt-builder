"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { usePrompts } from "@/hooks/use-prompts"
import type { Prompt } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate, replaceVariablesInContent } from "@/lib/utils"
import { ArrowLeft, Download, Edit, Eye, EyeOff } from "lucide-react"

export default function PromptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const promptId = params.id as string

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const promptsApi = usePrompts()

  useEffect(() => {
    const fetchPrompt = async () => {
      setIsLoading(true)
      try {
        const fetchedPrompt = await promptsApi.getPromptById(promptId)
        if (fetchedPrompt) {
          setPrompt(fetchedPrompt)

          // Initialize variable values
          const initialValues: Record<string, string> = {}
          fetchedPrompt.variables.forEach((variable) => {
            initialValues[variable.name] = ""
          })
          setVariableValues(initialValues)
        } else {
          router.push("/prompts")
        }
      } catch (error) {
        console.error("Failed to fetch prompt:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrompt()
  }, [promptId, router])

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleExportPrompt = () => {
    if (!prompt) return

    const dataStr = JSON.stringify(prompt, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `prompt-${prompt.id}-${new Date().getTime()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const previewContent = prompt ? replaceVariablesInContent(prompt.content, variableValues) : ""

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
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">Prompt not found</h3>
          <p className="text-muted-foreground mb-4">The prompt you're looking for doesn't exist or has been deleted.</p>
          <Button asChild>
            <Link href="/prompts">Back to Prompts</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" asChild>
            <Link href="/prompts">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prompts
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{prompt.name}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPrompt}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild>
            <Link href={`/prompts/${promptId}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Content</CardTitle>
              <CardDescription>Last updated on {formatDate(prompt.updatedAt)}</CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {showPreview ? (
                  <div className="whitespace-pre-wrap p-4 rounded-md bg-muted">{previewContent}</div>
                ) : (
                  <pre className="whitespace-pre-wrap p-4 rounded-md bg-muted">{prompt.content}</pre>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Variables</CardTitle>
              <CardDescription>Fill in the variables to see the preview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prompt.variables.length === 0 ? (
                <p className="text-sm text-muted-foreground">This prompt doesn't have any variables.</p>
              ) : (
                prompt.variables.map((variable) => (
                  <div key={variable.id} className="space-y-2">
                    <Label htmlFor={variable.name}>
                      {variable.name}
                      {variable.description && (
                        <span className="ml-1 text-xs text-muted-foreground">({variable.description})</span>
                      )}
                    </Label>
                    <Input
                      id={variable.name}
                      value={variableValues[variable.name] || ""}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      placeholder={`Enter ${variable.name}...`}
                    />
                  </div>
                ))
              )}

              {prompt.variables.length > 0 && (
                <Button className="w-full mt-4" onClick={() => setShowPreview(true)}>
                  <Eye className="mr-2 h-4 w-4" /> Preview Result
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

