import { mockPrompts, mockTemplates, extendedMockPrompts } from "./mock-data"
import type { Prompt, Template } from "@/types"

// This file provides utility functions to manage mock data
// In a real application, these would be API calls to a backend

export function addMockPrompt(prompt: Prompt): void {
  // Add to both arrays to ensure consistency
  mockPrompts.push(prompt)
  extendedMockPrompts.push(prompt)
}

export function updateMockPrompt(id: string, promptData: Partial<Prompt>): Prompt | null {
  const promptIndex = extendedMockPrompts.findIndex((p) => p.id === id)

  if (promptIndex === -1) {
    return null
  }

  const updatedPrompt = {
    ...extendedMockPrompts[promptIndex],
    ...promptData,
    updatedAt: new Date().toISOString(),
  }

  extendedMockPrompts[promptIndex] = updatedPrompt

  // Update in mockPrompts as well if it exists there
  const basicPromptIndex = mockPrompts.findIndex((p) => p.id === id)
  if (basicPromptIndex !== -1) {
    mockPrompts[basicPromptIndex] = updatedPrompt
  }

  return updatedPrompt
}

export function addMockTemplate(template: Template): void {
  mockTemplates.push(template)
}

export function updateMockTemplate(id: string, templateData: Partial<Template>): Template | null {
  const templateIndex = mockTemplates.findIndex((t) => t.id === id)

  if (templateIndex === -1) {
    return null
  }

  const updatedTemplate = {
    ...mockTemplates[templateIndex],
    ...templateData,
    updatedAt: new Date().toISOString(),
  }

  mockTemplates[templateIndex] = updatedTemplate

  return updatedTemplate
}

