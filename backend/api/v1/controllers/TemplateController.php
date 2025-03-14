<?php

namespace PromptBuilder\Controllers;

use PromptBuilder\Repositories\TemplateRepository;
use PromptBuilder\Models\Template;
use PromptBuilder\core\Request;
use PromptBuilder\core\Response;

class TemplateController {
    private TemplateRepository $repository;

    public function __construct() {
        $this->repository = new TemplateRepository();
    }

    // Создание нового Template
    public function create(Request $request, Response $response): void {
        $data = $request->getBody();

        try {
            $template = new Template($data);
            $this->repository->save($template);
            $response->json(['message' => 'Template created successfully'], 201);
        } catch (\Exception $e) {
            $response->json(['error' => $e->getMessage()], 400);
        }
    }

    // Получение Template по ID
    public function get(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        
        $template = $this->repository->findById($id);
        
        if ($template) {
            $response->json($template, 200);
        } else {
            $response->json(['error' => 'Template not found'], 404);
        }
    }

    // Обновление Template по ID
    public function update(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        $data = $request->getBody();

        try {
            if ($this->repository->updateById($id, $data)) {
                $response->json(['message' => 'Template updated successfully'], 200);
            } else {
                $response->json(['error' => 'Failed to update template'], 400);
            }
        } catch (\Exception $e) {
            $response->json(['error' => $e->getMessage()], 400);
        }
    }

    // Удаление Template по ID
    public function delete(Request $request, Response $response): void {
        $id = $request->getParams()['id'];
        
        if ($this->repository->deleteById($id)) {
            $response->json(['message' => 'Template deleted successfully'], 200);
        } else {
            $response->json(['error' => 'Failed to delete template'], 400);
        }
    }
}