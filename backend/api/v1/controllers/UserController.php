<?php

namespace PromptBuilder\controllers;

use PromptBuilder\models\User;
use PromptBuilder\Repositories\UserRepository;
use PromptBuilder\core\Request;
use PromptBuilder\core\Response;

class UserController {
    private UserRepository $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    /**
     * Получить текущего пользователя
     */
    public function getCurrentUser(Request $request, Response $response): void {
        try {
            // предполагается, что email пользователя берется из токена
            $user = $this->userRepository->findByEmail($request->getUser()['email']);
            if (!$user) {
                $response->json(["error" => "User not found"], 404);
                return;
            }

            $response->json([
                "id" => $user->getId(),
                "name" => $user->getName(),
                "email" => $user->getEmail(),
                "age" => $user->getAge()
            ]);
        } catch (\Exception $e) {
            $response->json(["error" => $e->getMessage()], 400);
        }  
    }

    /**
     * Создать нового пользователя
     */
    public function create(Request $request, Response $response): void {
        $data = $request->getBody();

        try {
            $user = new User($data);
            if ($this->userRepository->save($user)) {
                $response->json(["message" => "User created successfully"], 201);
            } else {
                $response->json(["error" => "Failed to create user"], 500);
            }
        } catch (\Exception $e) {
            $response->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Обновить данные пользователя
     */
    public function update(Request $request, Response $response): void {
        $params = $request->getParams();
        //$userId = $params['id'] ?? null;
        $userId = $request->getUser()['userId'];

        if (!$userId) {
            $response->json(["error" => "User ID is required"], 400);
            return;
        }

        $data = $request->getBody();
        unset($data['password']);

        try {
            $updated = $this->userRepository->updateById($userId, $data);

            if ($updated) {
                $response->json(["message" => "User updated successfully"], 200);
            } else {
                $response->json(["error" => "Failed to update user"], 500);
            }
        } catch (\Exception $e) {
            $response->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Удалить пользователя
     */
    public function delete(Request $request, Response $response, array $params): void {
        $userId = $params['id'] ?? null;
        if (!$userId) {
            $response->json(["error" => "User ID is required"], 400);
            return;
        }

        // Предположим, что у UserRepository есть метод deleteById
        if ($this->userRepository->deleteById($userId)) {
            $response->json(["message" => "User deleted successfully"], 204);
        } else {
            $response->json(["error" => "User not found"], 404);
        }
    }
}

