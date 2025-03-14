"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Prompt } from "@/types"
import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"

interface SortablePromptItemProps {
  id: string
  prompt: Prompt
  onRemove: () => void
}

export function SortablePromptItem({ id, prompt, onRemove }: SortablePromptItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-3 border rounded-md bg-card">
      <div {...attributes} {...listeners} className="cursor-grab touch-none p-1">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{prompt.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1">{prompt.content.substring(0, 60)}...</p>
      </div>

      <Button variant="ghost" size="icon" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

