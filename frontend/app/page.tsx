import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Layers, ArrowRight, Plus } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Prompt Builder Application</h1>
          <p className="text-xl text-muted-foreground">
            Create, manage, and organize AI prompts with our powerful drag-and-drop interface
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
            <FileText className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Prompt Management</h2>
            <p className="text-muted-foreground text-center mb-6">
              Create, edit, and organize your AI prompts with tags and variables
            </p>
            <Button asChild className="mt-auto">
              <Link href="/prompts">
                Browse Prompts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
            <Layers className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Template Builder</h2>
            <p className="text-muted-foreground text-center mb-6">
              Combine prompts into templates with our drag-and-drop interface
            </p>
            <Button asChild className="mt-auto">
              <Link href="/templates">
                Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Drag-and-drop interface for building prompts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Live preview of the result</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Tag and category system</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Responsive design</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Animations when dragging blocks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Interactive visualization of prompt structure</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Save favorite prompt combinations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>Export/Import prompts and templates</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/prompts/new/edit">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Prompt
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/templates/new/edit">
              <Layers className="mr-2 h-4 w-4" /> Create New Template
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

