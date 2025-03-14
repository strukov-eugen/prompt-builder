import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Prompt } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function extractVariablesFromContent(content: string): string[] {
  const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g
  const matches = content.matchAll(regex)
  const variables: string[] = []

  for (const match of matches) {
    if (match[1] && !variables.includes(match[1])) {
      variables.push(match[1])
    }
  }

  return variables
}

export function replaceVariablesInContent(content: string, variables: Record<string, string>): string {
  let result = content

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g")
    result = result.replace(regex, value)
  })

  return result
}

export function downloadJson(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generatePreviewForPrompt(prompt: Prompt): string {
  const previewLength = 100
  let preview = prompt.content

  // Replace variables with placeholders
  prompt.variables.forEach((variable) => {
    const regex = new RegExp(`\\{\\{\\s*${variable.name}\\s*\\}\\}`, "g")
    preview = preview.replace(regex, `[${variable.name}]`)
  })

  // Truncate if too long
  if (preview.length > previewLength) {
    preview = preview.substring(0, previewLength) + "..."
  }

  return preview
}

