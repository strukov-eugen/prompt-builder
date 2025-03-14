"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useTemplates } from "@/hooks/use-templates"
import { usePrompts } from "@/hooks/use-prompts"
import type { Template, Prompt } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, replaceVariablesInContent } from "@/lib/utils"
import { ArrowLeft, Download, Edit } from "lucide-react"

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const templatesApi = useTemplates()
  const promptsApi = usePrompts()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fetchedTemplate = await templatesApi.getTemplateById(templateId)
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate)

          // Fetch all prompts in the template
          const promptsData = await Promise.all(
            fetchedTemplate.prompts.map((item) => promptsApi.getPromptById(item.promptId)),
          )

          const validPrompts = promptsData.filter(Boolean) as Prompt[]
          setPrompts(validPrompts)

          // Initialize variable values
          const initialValues: Record<string, string> = {}
          validPrompts.forEach((prompt) => {
            prompt.variables.forEach((variable) => {
              initialValues[variable.name] = ""
            })
          })
          setVariableValues(initialValues)
        } else {
          router.push("/templates")
        }
      } catch (error) {
        console.error("Failed to fetch template:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [templateId, router])

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleExportTemplate = () => {
    if (!template) return

    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `template-${template.id}-${new Date().getTime()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Get all unique variables from all prompts
  const allVariables = prompts.flatMap((prompt) => prompt.variables)
  const uniqueVariables = allVariables.filter(
    (variable, index, self) => index === self.findIndex((v) => v.name === variable.name),
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

  if (!template) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">Template not found</h3>
          <p className="text-muted-foreground mb-4">
            The template you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/templates">Back to Templates</Link>
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
            <Link href="/templates">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{template.name}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTemplate}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild>
            <Link href={`/templates/${templateId}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
              <CardDescription>Last updated on {formatDate(template.updatedAt)}</CardDescription>
              {template.description && <p className="text-sm mt-2">{template.description}</p>}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="template">
                <TabsList className="mb-4">
                  <TabsTrigger value="template">Template Structure</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="template">
                  <div className="space-y-4">
                    {prompts.length === 0 ? (
                      <p className="text-muted-foreground">This template doesn't contain any prompts.</p>
                    ) : (
                      prompts.map((prompt, index) => (
                        <Card key={prompt.id}>
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                  {index + 1}
                                </div>
                                <CardTitle className="text-base">{prompt.name}</CardTitle>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/prompts/${prompt.id}`}>View</Link>
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <pre className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md">{prompt.content}</pre>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-4">
                    {prompts.length === 0 ? (
                      <p className="text-muted-foreground">This template doesn't contain any prompts.</p>
                    ) : (
                      prompts.map((prompt, index) => {
                        const previewContent = replaceVariablesInContent(prompt.content, variableValues)

                        return (
                          <Card key={prompt.id}>
                            <CardHeader className="py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                    {index + 1}
                                  </div>
                                  <CardTitle className="text-base">{prompt.name}</CardTitle>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="py-2">
                              <div className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md">
                                {previewContent}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
              {uniqueVariables.length === 0 ? (
                <p className="text-sm text-muted-foreground">This template doesn't have any variables.</p>
              ) : (
                uniqueVariables.map((variable) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

