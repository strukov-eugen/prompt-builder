"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePrompts } from "@/hooks/use-prompts"
import { useTags } from "@/hooks/use-tags"
import type { Prompt, Tag, PaginationParams, FilterParams } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, generatePreviewForPrompt } from "@/lib/utils"
import { Search, Plus, Filter, MoreVertical, Edit, Trash, Eye, Download, SortAsc, SortDesc } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [totalPrompts, setTotalPrompts] = useState(0)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  })
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    tags: [],
    sortBy: "updatedAt",
    sortOrder: "desc",
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const promptsApi = usePrompts()
  const tagsApi = useTags()
  const { user } = useAuth()

  const fetchPrompts = async () => {
    setIsLoading(true)
    try {
      const result = await promptsApi.getPrompts(pagination, {
        ...filters,
        tags: selectedTags,
      })
      setPrompts(result.prompts)
      setTotalPrompts(result.total)
    } catch (error) {
      console.error("Failed to fetch prompts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const fetchedTags = await tagsApi.getTags()
      setTags(fetchedTags)
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [pagination, filters, selectedTags])

  useEffect(() => {
    fetchTags()
  }, [])

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
    setPagination({ ...pagination, page: 1 })
  }

  const handleTagFilter = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]

    setSelectedTags(newSelectedTags)
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

  const handleDeletePrompt = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        const success = await promptsApi.deletePrompt(id)
        if (success) {
          fetchPrompts()
        }
      } catch (error) {
        console.error("Failed to delete prompt:", error)
      }
    }
  }

  const handleExportPrompt = (prompt: Prompt) => {
    const dataStr = JSON.stringify(prompt, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `prompt-${prompt.id}-${new Date().getTime()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const totalPages = Math.ceil(totalPrompts / pagination.limit)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground">Browse, search, and manage your AI prompts</p>
        </div>
        {user && (
          <Button asChild className="whitespace-nowrap">
            <Link href="/prompts/new/edit">
              <Plus className="mr-2 h-4 w-4" /> Create Prompt
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.map((tag) => (
                <DropdownMenuItem
                  key={tag.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleTagFilter(tag.id)}
                >
                  {tag.name}
                  {selectedTags.includes(tag.id) && <span className="h-2 w-2 rounded-full bg-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            return tag ? (
              <Badge
                key={tag.id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleTagFilter(tag.id)}
              >
                {tag.name} ×
              </Badge>
            ) : null
          })}
          <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
            Clear all
          </Button>
        </div>
      )}

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
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No prompts found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Get started by creating your first prompt"}
          </p>
          <Button asChild>
            <Link href="/prompts/new/edit">
              <Plus className="mr-2 h-4 w-4" /> Create Prompt
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{prompt.name}</CardTitle>
                    <CardDescription>{formatDate(prompt.updatedAt)}</CardDescription>
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
                        <Link href={`/prompts/${prompt.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/prompts/${prompt.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportPrompt(prompt)}>
                        <Download className="mr-2 h-4 w-4" /> Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeletePrompt(prompt.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{generatePreviewForPrompt(prompt)}</p>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  {prompt.variables.length} variable{prompt.variables.length !== 1 ? "s" : ""}
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/prompts/${prompt.id}`}>View Details</Link>
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

