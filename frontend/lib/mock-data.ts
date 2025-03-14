import type { Prompt, Tag, Template, Variable } from "@/types"

export const mockTags: Tag[] = [
  { id: "1", name: "AI" },
  { id: "2", name: "Copywriting" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "SEO" },
  { id: "5", name: "Social Media" },
  { id: "6", name: "Email" },
  { id: "7", name: "Technical" },
  { id: "8", name: "Creative" },
]

export const mockVariables: Variable[] = [
  { id: "1", name: "product_name", description: "Name of the product" },
  { id: "2", name: "company_name", description: "Name of the company" },
  { id: "3", name: "target_audience", description: "Target audience for the content" },
  { id: "4", name: "key_features", description: "Key features of the product" },
  { id: "5", name: "tone", description: "Tone of the content (formal, casual, etc.)" },
  { id: "6", name: "word_count", description: "Desired word count" },
]

export const mockPrompts: Prompt[] = [
  {
    id: "1",
    name: "Product Description",
    content:
      "Write a compelling product description for {{ product_name }} by {{ company_name }}. The target audience is {{ target_audience }}. Key features include: {{ key_features }}. Use a {{ tone }} tone.",
    tags: [mockTags[1], mockTags[2]],
    variables: [mockVariables[0], mockVariables[1], mockVariables[2], mockVariables[3], mockVariables[4]],
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Blog Post Outline",
    content:
      "Create an outline for a blog post about {{ product_name }}. The post should be approximately {{ word_count }} words and target {{ target_audience }}.",
    tags: [mockTags[1], mockTags[3]],
    variables: [mockVariables[0], mockVariables[2], mockVariables[5]],
    createdAt: "2023-01-20T14:45:00Z",
    updatedAt: "2023-01-25T09:15:00Z",
  },
  {
    id: "3",
    name: "Social Media Post",
    content:
      "Write a {{ tone }} social media post for {{ company_name }} promoting {{ product_name }}. Highlight these features: {{ key_features }}.",
    tags: [mockTags[1], mockTags[4]],
    variables: [mockVariables[0], mockVariables[1], mockVariables[3], mockVariables[4]],
    createdAt: "2023-02-05T11:20:00Z",
    updatedAt: "2023-02-05T11:20:00Z",
  },
  {
    id: "4",
    name: "Email Newsletter",
    content:
      "Draft an email newsletter for {{ company_name }} announcing {{ product_name }}. The email should be in a {{ tone }} tone and highlight the following features: {{ key_features }}.",
    tags: [mockTags[1], mockTags[5]],
    variables: [mockVariables[0], mockVariables[1], mockVariables[3], mockVariables[4]],
    createdAt: "2023-02-10T16:30:00Z",
    updatedAt: "2023-02-12T08:45:00Z",
  },
  {
    id: "5",
    name: "Technical Documentation",
    content:
      "Create technical documentation for {{ product_name }}. Include the following features and specifications: {{ key_features }}.",
    tags: [mockTags[6]],
    variables: [mockVariables[0], mockVariables[3]],
    createdAt: "2023-02-15T13:10:00Z",
    updatedAt: "2023-02-15T13:10:00Z",
  },
  {
    id: "6",
    name: "Creative Story",
    content:
      "Write a creative story about {{ product_name }} in a {{ tone }} style. The story should appeal to {{ target_audience }} and be approximately {{ word_count }} words.",
    tags: [mockTags[7]],
    variables: [mockVariables[0], mockVariables[2], mockVariables[4], mockVariables[5]],
    createdAt: "2023-02-20T09:25:00Z",
    updatedAt: "2023-02-20T09:25:00Z",
  },
]

export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Marketing Campaign",
    description: "Complete marketing campaign template with product description, blog post, and social media content",
    prompts: [
      { id: "1", promptId: "1", order: 1 },
      { id: "2", promptId: "2", order: 2 },
      { id: "3", promptId: "3", order: 3 },
    ],
    createdAt: "2023-03-01T10:00:00Z",
    updatedAt: "2023-03-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Product Launch",
    description: "Template for launching a new product with technical documentation and email announcement",
    prompts: [
      { id: "1", promptId: "5", order: 1 },
      { id: "2", promptId: "4", order: 2 },
    ],
    createdAt: "2023-03-05T14:30:00Z",
    updatedAt: "2023-03-05T14:30:00Z",
  },
]

// Generate more mock prompts for pagination testing
export const generateMockPrompts = (count: number): Prompt[] => {
  const additionalPrompts: Prompt[] = []

  for (let i = 7; i < 7 + count; i++) {
    additionalPrompts.push({
      id: i.toString(),
      name: `Sample Prompt ${i}`,
      content: `This is sample prompt content ${i} with {{ variable_${(i % 3) + 1} }} and {{ another_variable_${(i % 2) + 1} }}.`,
      tags: [mockTags[i % mockTags.length]],
      variables: [
        { id: `v${i}1`, name: `variable_${(i % 3) + 1}`, description: `Variable ${(i % 3) + 1} description` },
        {
          id: `v${i}2`,
          name: `another_variable_${(i % 2) + 1}`,
          description: `Another variable ${(i % 2) + 1} description`,
        },
      ],
      createdAt: new Date(2023, 2, i).toISOString(),
      updatedAt: new Date(2023, 2, i).toISOString(),
    })
  }

  return [...mockPrompts, ...additionalPrompts]
}

// Extended mock data for pagination
export const extendedMockPrompts = generateMockPrompts(20)

