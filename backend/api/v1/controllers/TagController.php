<?php

namespace PromptBuilder\Controllers;

use PromptBuilder\Repositories\TagRepository;
use PromptBuilder\Models\Tag;
use PromptBuilder\core\Request;
use PromptBuilder\core\Response;

class TagController {
    private TagRepository $repository;

    public function __construct() {
        $this->repository = new TagRepository();
    }

    // Создание нового Tag
    public function create(Request $request, Response $response): void {
        $data = $request->getBody();

        try {
            $tag = new Tag($data);
            $this->repository->save($tag);
            $response->json(['message' => 'Tag created successfully'], 201);
        } catch (\Exception $e) {
            $response->json(['error' => $e->getMessage()], 400);
        }
    }

    // Получение Tag по ID
    public function get(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        
        $tag = $this->repository->findById($id);
        
        if ($tag) {
            $response->json($tag, 200);
        } else {
            $response->json(['error' => 'Tag not found'], 404);
        }
    }

    // Обновление Tag по ID
    public function update(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        $data = $request->getBody();

        try {
            if ($this->repository->updateById($id, $data)) {
                $response->json(['message' => 'Tag updated successfully'], 200);
            } else {
                $response->json(['error' => 'Failed to update tag'], 400);
            }
        } catch (\Exception $e) {
            $response->json(['error' => $e->getMessage()], 400);
        }
    }

    // Удаление Tag по ID
    public function delete(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        
        if ($this->repository->deleteById($id)) {
            $response->json(['message' => 'Tag deleted successfully'], 200);
        } else {
            $response->json(['error' => 'Failed to delete tag'], 400);
        }
    }
}