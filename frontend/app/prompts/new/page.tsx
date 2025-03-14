"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewPromptPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the edit page with "new" as the ID
    router.replace("/prompts/new/edit")
  }, [router])

  return (
    <div className="container py-8 flex items-center justify-center">
      <p>Redirecting to prompt editor...</p>
    </div>
  )
}

