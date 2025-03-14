"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTemplates } from "@/hooks/use-templates"
import type { Template, PaginationParams, FilterParams } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { Search, Plus, MoreVertical, Edit, Trash, Eye, Download, SortAsc, SortDesc, Layers } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [totalTemplates, setTotalTemplates] = useState(0)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  })
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    sortBy: "updatedAt",
    sortOrder: "desc",
  })
  const [isLoading, setIsLoading] = useState(true)

  const templatesApi = useTemplates()
  const { user } = useAuth()

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const result = await templatesApi.getTemplates(pagination, filters)
      setTemplates(result.templates)
      setTotalTemplates(result.total)
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [pagination, filters])

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
    setPagination({ ...pagination, page: 1 })
  }

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value })
  }

  const handleSortOrderChange = () => {
    setFilters({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    })
  }

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page })
  }

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        const success = await templatesApi.deleteTemplate(id)
        if (success) {
          fetchTemplates()
        }
      } catch (error) {
        console.error("Failed to delete template:", error)
      }
    }
  }

  const handleExportTemplate = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `template-${template.id}-${new Date().getTime()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const totalPages = Math.ceil(totalTemplates / pagination.limit)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">Create and manage templates by combining prompts</p>
        </div>
        {user && (
          <Button asChild className="whitespace-nowrap">
            <Link href="/templates/new/edit">
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="updatedAt">Updated Date</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleSortOrderChange}>
            {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search ? "Try adjusting your search" : "Get started by creating your first template"}
          </p>
          <Button asChild>
            <Link href="/templates/new/edit">
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{template.name}</CardTitle>
                    <CardDescription>{formatDate(template.updatedAt)}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/templates/${template.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/templates/${template.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportTemplate(template)}>
                        <Download className="mr-2 h-4 w-4" /> Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {template.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  {template.prompts.length} prompt{template.prompts.length !== 1 ? "s" : ""}
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/templates/${template.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.page > 1) {
                    handlePageChange(pagination.page - 1)
                  }
                }}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1

              // Show first page, last page, and pages around current page
              if (page === 1 || page === totalPages || (page >= pagination.page - 1 && page <= pagination.page + 1)) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={page === pagination.page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              // Show ellipsis for gaps
              if (
                (page === 2 && pagination.page > 3) ||
                (page === totalPages - 1 && pagination.page < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return null
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.page < totalPages) {
                    handlePageChange(pagination.page + 1)
                  }
                }}
                className={pagination.page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

