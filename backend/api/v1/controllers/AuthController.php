<?php

namespace PromptBuilder\controllers;

use PromptBuilder\core\Request;
use PromptBuilder\core\Response;
use PromptBuilder\models\User;
use PromptBuilder\Repositories\UserRepository;
use Firebase\JWT\JWT;

class AuthController {

    private string $jwtSecret;
    private string $refreshSecret;
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'your_jwt_secret';
        $this->refreshSecret = $_ENV['REFRESH_TOKEN_SECRET'] ?? 'refresh_secret';
        $this->userRepository = $userRepository;
    }

    // Регистрация нового пользователя
    public function register(Request $req, Response $res) {
        try {
            // Извлекаем данные из тела запроса
            $body = $req->getBody();
            $password = $body['password'] ?? null;
            // Проверка пароля (должен быть алфавитно-цифровой и длина 8-20 символов)
            if (!preg_match('/^[a-zA-Z0-9]+$/', $password)) {
                $res->json(['message' => 'Password can only contain alphanumeric characters.'], 400);
            }
            if (strlen($password) < 8 || strlen($password) > 20) {
                $res->json(['message' => 'Password must be between 8 and 20 characters.'], 400);
            }
            // Хэшируем пароль
            $body['password'] = password_hash($password, PASSWORD_BCRYPT);
            // Пытаемся создать объект пользователя
            $user = new User($body);
            $this->userRepository->save($user);
            $res->json(['message' => 'User registered successfully'], 201);
        } catch (\InvalidArgumentException $e) {
            // Возвращаем ошибку, если произошла ошибка валидации данных
            $res->json(['message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            // Ловим все остальные ошибки и выводим их
            $res->json(['message' => 'Error registering user', 'error' => $e->getMessage()], 500);
        }
    }

    // Логин пользователя
    public function login(Request $req, Response $res) {
        try {
            $body = $req->getBody();

            $user = $this->userRepository->findByEmail($body['email']);
            if (!$user || !password_verify($body['password'], $user->getPassword())) {
                $res->json(['message' => 'Invalid credentials'], 401);
            }

            $accessToken = JWT::encode(
                ['userId' => $user->getId(), 'email' => $user->getEmail(), 'exp' => time() + 900], // 15 минут
                $this->jwtSecret,
                'HS256'
            );

            $refreshToken = JWT::encode(
                ['userId' => $user->getId(), 'email' => $user->getEmail(), 'exp' => time() + 604800], // 7 дней
                $this->refreshSecret,
                'HS256'
            );

            $res->json([
                'message' => 'Login successful',
                'accessToken' => $accessToken,
                'refreshToken' => $refreshToken
            ]);
        } catch (\Exception $e) {
            $res->json(['message' => 'Error logging in', 'error' => $e->getMessage()], 500);
        }
    }

    // Обновление access-токена
    public function refreshToken(Request $req, Response $res) {
        try {
            // Получаем данные из тела запроса
            $body = $req->getBody();
            $token = $body['token'] ?? null;

            // Если токен не передан
            if (!$token) {
                $res->json(['message' => 'Refresh token is required'], 400);
            }

            // Декодируем токен с использованием строкового ключа
            $decoded = JWT::decode($token, $this->refreshSecret);

            // Генерация нового access токена
            $newAccessToken = JWT::encode(
                ['userId' => $decoded->userId, 'email' => $decoded->email, 'exp' => time() + 900],
                $this->jwtSecret,
                'HS256'
            );

            // Отправляем новый токен
            $res->json(['accessToken' => $newAccessToken]);

        } catch (\Exception $e) {
            // Возвращаем ошибку, если токен некорректный или истек
            $res->json(['message' => 'Invalid or expired refresh token', 'error' => $e->getMessage()], 401);
        }
    }
}

