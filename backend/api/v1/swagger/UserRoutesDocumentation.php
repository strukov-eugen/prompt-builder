<?php

namespace PromptBuilder\swagger;

use OpenApi\Attributes as OA;

class UserRoutesDocumentation
{
    // Атрибуты для маршрута /me
    #[OA\Get(
        path: '/api/v1/users/me',
        summary: 'Получить данные текущего пользователя',
        description: 'Возвращает данные пользователя, который аутентифицирован.',
        responses: [
            new OA\Response(response: 200, description: 'Успешное получение данных пользователя.'),
            new OA\Response(response: 401, description: 'Пользователь не аутентифицирован.'),
            new OA\Response(response: 404, description: 'Пользователь не найден.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function getCurrentUser(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута /users
    #[OA\Get(
        path: '/api/v1/users',
        summary: 'Получить список пользователей',
        description: 'Получает список пользователей по переданным параметрам (ID, email и т. д.).',
        parameters: [
            new OA\Parameter(name: '_id', in: 'query', description: 'Получить пользователя по его ID', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'ids', in: 'query', description: 'Получить нескольких пользователей по ID (через запятую)', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'email', in: 'query', description: 'Найти пользователя по email', schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Успешное получение списка пользователей.'),
            new OA\Response(response: 400, description: 'Неверные параметры запроса.'),
            new OA\Response(response: 403, description: 'Доступ запрещен.'),
            new OA\Response(response: 404, description: 'Пользователи не найдены.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function getUsers(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута POST /users
    #[OA\Post(
        path: '/api/v1/users',
        summary: 'Создать нового пользователя',
        description: 'Регистрирует нового пользователя.',
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['name', 'email'],
                    properties: [
                        new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                        new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                        new OA\Property(property: 'age', type: 'integer', example: 30),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Пользователь успешно создан.'),
            new OA\Response(response: 400, description: 'Ошибка валидации данных.'),
            new OA\Response(response: 500, description: 'Внутренняя ошибка сервера.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function create(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута PUT /users/{id}
    #[OA\Put(
        path: '/api/v1/users/{id}',
        summary: 'Обновить пользователя',
        description: 'Обновляет информацию пользователе по ID.',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID пользователя', schema: new OA\Schema(type: 'string')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: [
                'application/json' => new OA\MediaType(
                    mediaType: 'application/json',
                    schema: new OA\Schema(
                        type: 'object',
                        properties: [
                            new OA\Property(
                                property: 'name',
                                type: 'string',
                                example: 'John Doe Updated'
                            ),
                            new OA\Property(
                                property: 'email',
                                type: 'string',
                                example: 'john_updated@example.com'
                            ),
                            new OA\Property(
                                property: 'age',
                                type: 'integer',
                                example: 31
                            )
                        ]
                    )
                )
            ]
        ),
        responses: [
            new OA\Response(response: 200, description: 'Пользователь успешно обновлён.'),
            new OA\Response(response: 400, description: 'Ошибка валидации данных.'),
            new OA\Response(response: 404, description: 'Пользователь не найден.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function update(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута DELETE /users/{id}
    #[OA\Delete(
        path: '/api/v1/users/{id}',
        summary: 'Удалить пользователя',
        description: 'Удаляет пользователя по ID.',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID пользователя', schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Пользователь успешно удалён.'),
            new OA\Response(response: 404, description: 'Пользователь не найден.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function delete(): void
    {
        // Пустой метод для генерации документации
    }
}