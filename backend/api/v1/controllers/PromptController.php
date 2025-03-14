<?php

namespace PromptBuilder\Controllers;

use PromptBuilder\Repositories\PromptRepository;
use PromptBuilder\Models\Prompt;
use PromptBuilder\Core\Request;
use PromptBuilder\Core\Response;

class PromptController {
    private PromptRepository $repository;

    public function __construct() {
        $this->repository = new PromptRepository();
    }

    // Создание нового Prompt
    public function create(Request $request, Response $response): void {
        $data = $request->getBody();

        try {
            $prompt = new Prompt($data);
            $this->repository->save($prompt);
            $response->json(['message' => 'Prompt created successfully', 'prompt' => $prompt], 201);
        } catch (\Exception $e) {
            $response->json(['error' => 'Failed to create prompt: ' . $e->getMessage()], 400);
        }
    }

    // Получение всех Prompt с фильтрами, пагинацией и сортировкой
    public function getAll(Request $request, Response $response): void {
        $params = $request->getQueryParams();
        $page = (int)($params['page'] ?? 1);
        $limit = (int)($params['limit'] ?? 10);
        $search = $params['search'] ?? '';
        $tags = $params['tags'] ?? [];
        $sortBy = $params['sortBy'] ?? 'updated_at';
        $sortOrder = $params['sortOrder'] ?? 'desc';

        try {
            $prompts = $this->repository->findAllWithFilters($search, $tags, $sortBy, $sortOrder, $page, $limit);
            $total = $this->repository->countAllWithFilters($search, $tags);

            $response->json([
                'prompts' => $prompts,
                'total' => $total
            ], 200);
        } catch (\Exception $e) {
            $response->json(['error' => 'Failed to fetch prompts: ' . $e->getMessage()], 400);
        }
    }

    // Получение Prompt по ID
    public function get(Request $request, Response $response): void {
        $id = $request->getParams()['id'];

        try {
            $prompt = $this->repository->findById($id);
            
            if ($prompt) {
                $response->json($prompt, 200);
            } else {
                $response->json(['error' => 'Prompt not found'], 404);
            }
        } catch (\Exception $e) {
            $response->json(['error' => 'Failed to fetch prompt: ' . $e->getMessage()], 400);
        }
    }

    // Обновление Prompt по ID
    public function update(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        $data = $request->getBody();

        try {
            if ($this->repository->updateById($id, $data)) {
                $response->json(['message' => 'Prompt updated successfully'], 200);
            } else {
                $response->json(['error' => 'Failed to update prompt'], 400);
            }
        } catch (\Exception $e) {
            $response->json(['error' => 'Failed to update prompt: ' . $e->getMessage()], 400);
        }
    }

    // Удаление Prompt по ID
    public function delete(Request $request, Response $response): void {
        $id = $request->getParams()['id'];

        try {
            if ($this->repository->deleteById($id)) {
                $response->json(['message' => 'Prompt deleted successfully'], 200);
            } else {
                $response->json(['error' => 'Failed to delete prompt'], 400);
            }
        } catch (\Exception $e) {
            $response->json(['error' => 'Failed to delete prompt: ' . $e->getMessage()], 400);
        }
    }
}