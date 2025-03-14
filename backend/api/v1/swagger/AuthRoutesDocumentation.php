<?php

namespace PromptBuilder\swagger;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'My API',
    version: '1.0.0',
    description: 'Описание вашего API для работы c пользователями и аутентификацией.'
)]
#[OA\PathItem(
    path: '/api/v1'
)]
#[OA\SecurityScheme(
    securityScheme: 'BearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'JWT аутентификация'
)]
class AuthRoutesDocumentation
{
    // Атрибуты для маршрута /register
    #[OA\Post(
        path: '/api/v1/auth/register',
        summary: 'Регистрация нового пользователя',
        description: 'Регистрирует нового пользователя c передачей email, пароля и других данных.',
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['email', 'password'],
                    properties: [
                        new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                        new OA\Property(property: 'password', type: 'string', example: 'password123'),
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                        new OA\Property(property: 'age', type: 'integer', example: 25),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Пользователь успешно зарегистрирован'),
            new OA\Response(response: 400, description: 'Ошибка валидации данных'),
            new OA\Response(response: 500, description: 'Ошибка сервера'),
        ]
    )]
    public function register(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута /login
    #[OA\Post(
        path: '/api/v1/auth/login',
        summary: 'Логин пользователя',
        description: 'Вход пользователя c использованием email и пароля.',
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['email', 'password'],
                    properties: [
                        new OA\Property(property: 'email', type: 'string', example: 'user@example.com'),
                        new OA\Property(property: 'password', type: 'string', example: 'password123'),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Успешный логин, возвращает токены.'),
            new OA\Response(response: 400, description: 'Ошибка валидации данных'),
            new OA\Response(response: 401, description: 'Неверные учетные данные'),
            new OA\Response(response: 500, description: 'Ошибка сервера'),
        ]
    )]
    public function login(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута /refresh-token
    #[OA\Post(
        path: '/api/v1/auth/refresh-token',
        summary: 'Обновление access токена',
        description: 'Обновляет access токен, используя refresh token.',
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['token'],
                    properties: [
                        new OA\Property(property: 'token', type: 'string', example: 'refresh_token_here'),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Новый access token'),
            new OA\Response(response: 400, description: 'Ошибка, если refresh token не передан.'),
            new OA\Response(response: 401, description: 'Неверный или просроченный refresh token'),
            new OA\Response(response: 500, description: 'Ошибка сервера'),
        ]
    )]
    public function refreshToken(): void
    {
        // Пустой метод для генерации документации
    }
}
