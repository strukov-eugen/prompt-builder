/**
 * API Tests for Prompt Builder Application
 *
 * This file contains test cases for all API endpoints used in the Prompt Builder application.
 * Each test includes the request details and expected response format.
 *
 * These tests can be used as a reference when implementing the server-side functionality.
 */

import type { Prompt, Template } from "@/types"
import { describe, test, expect } from "@jest/globals"

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Sample data for testing
const samplePrompt: Omit<Prompt, "id" | "createdAt" | "updatedAt"> = {
  name: "Product Description",
  content: "Write a compelling product description for {{ product_name }} by {{ company_name }}.",
  tags: [
    { id: "1", name: "Marketing" },
    { id: "2", name: "Copywriting" },
  ],
  variables: [
    { id: "1", name: "product_name", description: "Name of the product" },
    { id: "2", name: "company_name", description: "Name of the company" },
  ],
}

const sampleTemplate: Omit<Template, "id" | "createdAt" | "updatedAt"> = {
  name: "Marketing Campaign",
  description: "Complete marketing campaign template",
  prompts: [
    { id: "1", promptId: "1", order: 1 },
    { id: "2", promptId: "2", order: 2 },
  ],
}

const sampleTag = {
  name: "SEO",
}

/**
 * PROMPTS API
 */
describe("Prompts API", () => {
  /**
   * GET /api/prompts
   * Get a list of prompts with pagination and filtering
   */
  test("GET /api/prompts - List prompts", async () => {
    const endpoint = `${API_BASE_URL}/prompts`

    // Request with query parameters
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      // Query parameters
      // page: Page number (default: 1)
      // limit: Number of items per page (default: 10)
      // search: Search term for prompt name or content
      // tags: Comma-separated list of tag IDs
      // sortBy: Field to sort by (name, createdAt, updatedAt)
      // sortOrder: Sort order (asc, desc)
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        prompts: [
          {
            id: expect.any(String),
            name: expect.any(String),
            content: expect.any(String),
            tags: expect.arrayContaining([
              {
                id: expect.any(String),
                name: expect.any(String),
              },
            ]),
            variables: expect.arrayContaining([
              {
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
              },
            ]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
        total: expect.any(Number),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
      },
    }

    // Example implementation
    // const response = await fetch(`${endpoint}?page=1&limit=10&search=product&tags=1,2&sortBy=updatedAt&sortOrder=desc`);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * GET /api/prompts/:id
   * Get a single prompt by ID
   */
  test("GET /api/prompts/:id - Get prompt by ID", async () => {
    const promptId = "1"
    const endpoint = `${API_BASE_URL}/prompts/${promptId}`

    // Request
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        id: expect.any(String),
        name: expect.any(String),
        content: expect.any(String),
        tags: expect.arrayContaining([
          {
            id: expect.any(String),
            name: expect.any(String),
          },
        ]),
        variables: expect.arrayContaining([
          {
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
          },
        ]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * POST /api/prompts
   * Create a new prompt
   */
  test("POST /api/prompts - Create prompt", async () => {
    const endpoint = `${API_BASE_URL}/prompts`

    // Request
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify(samplePrompt),
    }

    // Expected response
    const expectedResponse = {
      status: 201,
      body: {
        id: expect.any(String),
        name: samplePrompt.name,
        content: samplePrompt.content,
        tags: samplePrompt.tags,
        variables: samplePrompt.variables,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(samplePrompt)
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * PUT /api/prompts/:id
   * Update an existing prompt
   */
  test("PUT /api/prompts/:id - Update prompt", async () => {
    const promptId = "1"
    const endpoint = `${API_BASE_URL}/prompts/${promptId}`

    // Request
    const request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify({
        name: "Updated Product Description",
        content: "Write an updated product description for {{ product_name }}.",
        tags: [{ id: "1", name: "Marketing" }],
        variables: [{ id: "1", name: "product_name", description: "Name of the product" }],
      }),
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        id: promptId,
        name: "Updated Product Description",
        content: "Write an updated product description for {{ product_name }}.",
        tags: [{ id: "1", name: "Marketing" }],
        variables: [{ id: "1", name: "product_name", description: "Name of the product" }],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request.body)
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * DELETE /api/prompts/:id
   * Delete a prompt
   */
  test("DELETE /api/prompts/:id - Delete prompt", async () => {
    const promptId = "1"
    const endpoint = `${API_BASE_URL}/prompts/${promptId}`

    // Request
    const request = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 204,
      body: null,
    }

    // Example implementation
    // const response = await fetch(endpoint, { method: 'DELETE' });
    // expect(response.status).toBe(expectedResponse.status);
  })
})

/**
 * TEMPLATES API
 */
describe("Templates API", () => {
  /**
   * GET /api/templates
   * Get a list of templates with pagination and filtering
   */
  test("GET /api/templates - List templates", async () => {
    const endpoint = `${API_BASE_URL}/templates`

    // Request with query parameters
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      // Query parameters
      // page: Page number (default: 1)
      // limit: Number of items per page (default: 10)
      // search: Search term for template name or description
      // sortBy: Field to sort by (name, createdAt, updatedAt)
      // sortOrder: Sort order (asc, desc)
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        templates: [
          {
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            prompts: expect.arrayContaining([
              {
                id: expect.any(String),
                promptId: expect.any(String),
                order: expect.any(Number),
              },
            ]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
        total: expect.any(Number),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
      },
    }

    // Example implementation
    // const response = await fetch(`${endpoint}?page=1&limit=10&search=marketing&sortBy=updatedAt&sortOrder=desc`);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * GET /api/templates/:id
   * Get a single template by ID
   */
  test("GET /api/templates/:id - Get template by ID", async () => {
    const templateId = "1"
    const endpoint = `${API_BASE_URL}/templates/${templateId}`

    // Request
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        prompts: expect.arrayContaining([
          {
            id: expect.any(String),
            promptId: expect.any(String),
            order: expect.any(Number),
          },
        ]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * POST /api/templates
   * Create a new template
   */
  test("POST /api/templates - Create template", async () => {
    const endpoint = `${API_BASE_URL}/templates`

    // Request
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify(sampleTemplate),
    }

    // Expected response
    const expectedResponse = {
      status: 201,
      body: {
        id: expect.any(String),
        name: sampleTemplate.name,
        description: sampleTemplate.description,
        prompts: sampleTemplate.prompts,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(sampleTemplate)
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * PUT /api/templates/:id
   * Update an existing template
   */
  test("PUT /api/templates/:id - Update template", async () => {
    const templateId = "1"
    const endpoint = `${API_BASE_URL}/templates/${templateId}`

    // Request
    const request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify({
        name: "Updated Marketing Campaign",
        description: "Updated marketing campaign template",
        prompts: [
          { id: "1", promptId: "1", order: 1 },
          { id: "3", promptId: "3", order: 2 },
        ],
      }),
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        id: templateId,
        name: "Updated Marketing Campaign",
        description: "Updated marketing campaign template",
        prompts: [
          { id: "1", promptId: "1", order: 1 },
          { id: "3", promptId: "3", order: 2 },
        ],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request.body)
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * DELETE /api/templates/:id
   * Delete a template
   */
  test("DELETE /api/templates/:id - Delete template", async () => {
    const templateId = "1"
    const endpoint = `${API_BASE_URL}/templates/${templateId}`

    // Request
    const request = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 204,
      body: null,
    }

    // Example implementation
    // const response = await fetch(endpoint, { method: 'DELETE' });
    // expect(response.status).toBe(expectedResponse.status);
  })
})

/**
 * TAGS API
 */
describe("Tags API", () => {
  /**
   * GET /api/tags
   * Get a list of all tags
   */
  test("GET /api/tags - List tags", async () => {
    const endpoint = `${API_BASE_URL}/tags`

    // Request
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: expect.arrayContaining([
        {
          id: expect.any(String),
          name: expect.any(String),
        },
      ]),
    }

    // Example implementation
    // const response = await fetch(endpoint);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * POST /api/tags
   * Create a new tag
   */
  test("POST /api/tags - Create tag", async () => {
    const endpoint = `${API_BASE_URL}/tags`

    // Request
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify(sampleTag),
    }

    // Expected response
    const expectedResponse = {
      status: 201,
      body: {
        id: expect.any(String),
        name: sampleTag.name,
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(sampleTag)
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })
})

/**
 * IMPORT/EXPORT API
 */
describe("Import/Export API", () => {
  /**
   * POST /api/import/prompts
   * Import prompts from JSON
   */
  test("POST /api/import/prompts - Import prompts", async () => {
    const endpoint = `${API_BASE_URL}/import/prompts`

    // Request
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify({
        prompts: [samplePrompt],
      }),
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        imported: expect.any(Number),
        failed: expect.any(Number),
        prompts: expect.arrayContaining([
          {
            id: expect.any(String),
            name: expect.any(String),
          },
        ]),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompts: [samplePrompt] })
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * POST /api/import/templates
   * Import templates from JSON
   */
  test("POST /api/import/templates - Import templates", async () => {
    const endpoint = `${API_BASE_URL}/import/templates`

    // Request
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
      body: JSON.stringify({
        templates: [sampleTemplate],
      }),
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        imported: expect.any(Number),
        failed: expect.any(Number),
        templates: expect.arrayContaining([
          {
            id: expect.any(String),
            name: expect.any(String),
          },
        ]),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ templates: [sampleTemplate] })
    // });
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * GET /api/export/prompts
   * Export all prompts as JSON
   */
  test("GET /api/export/prompts - Export prompts", async () => {
    const endpoint = `${API_BASE_URL}/export/prompts`

    // Request
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        prompts: expect.arrayContaining([
          {
            id: expect.any(String),
            name: expect.any(String),
            content: expect.any(String),
            tags: expect.any(Array),
            variables: expect.any(Array),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })

  /**
   * GET /api/export/templates
   * Export all templates as JSON
   */
  test("GET /api/export/templates - Export templates", async () => {
    const endpoint = `${API_BASE_URL}/export/templates`

    // Request
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ${token}",
      },
    }

    // Expected response
    const expectedResponse = {
      status: 200,
      body: {
        templates: expect.arrayContaining([
          {
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            prompts: expect.any(Array),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      },
    }

    // Example implementation
    // const response = await fetch(endpoint);
    // const data = await response.json();
    // expect(response.status).toBe(expectedResponse.status);
    // expect(data).toMatchObject(expectedResponse.body);
  })
})

