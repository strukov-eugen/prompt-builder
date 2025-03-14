"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NewTemplatePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the edit page with "new" as the ID
    router.replace("/templates/new/edit")
  }, [router])

  return (
    <div className="container py-8 flex items-center justify-center">
      <p>Redirecting to template editor...</p>
    </div>
  )
}

