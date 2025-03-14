<?php

namespace PromptBuilder\swagger;

use OpenApi\Attributes as OA;

class PromptRoutesDocumentation
{
    // Атрибуты для маршрута GET /prompts
    #[OA\Get(
        path: '/api/v1/prompts',
        summary: 'Получить список промтов',
        description: 'Возвращает список промтов с фильтрами, пагинацией и сортировкой.',
        parameters: [
            new OA\Parameter(name: 'page', in: 'query', description: 'Номер страницы для пагинации', schema: new OA\Schema(type: 'integer', example: 1)),
            new OA\Parameter(name: 'limit', in: 'query', description: 'Количество промтов на странице', schema: new OA\Schema(type: 'integer', example: 10)),
            new OA\Parameter(name: 'search', in: 'query', description: 'Поиск по названию или содержимому промта', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'tags', in: 'query', description: 'Фильтрация по тегам (список через запятую)', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'sortBy', in: 'query', description: 'Поле для сортировки', schema: new OA\Schema(type: 'string', example: 'updatedAt')),
            new OA\Parameter(name: 'sortOrder', in: 'query', description: 'Направление сортировки', schema: new OA\Schema(type: 'string', example: 'desc')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Успешное получение списка промтов.'),
            new OA\Response(response: 400, description: 'Неверные параметры запроса.'),
            new OA\Response(response: 500, description: 'Ошибка сервера.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function getAll(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута GET /prompts/{id}
    #[OA\Get(
        path: '/api/v1/prompts/{id}',
        summary: 'Получить промт по ID',
        description: 'Возвращает промт с указанным ID.',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID промта', schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Успешное получение промта по ID.'),
            new OA\Response(response: 404, description: 'Промт не найден.'),
            new OA\Response(response: 500, description: 'Ошибка сервера.'),
        ],
        security: [
            [
                'BearerAuth' => []
            ]
        ]
    )]
    public function get(): void
    {
        // Пустой метод для генерации документации
    }

    // Атрибуты для маршрута POST /prompts
    #[OA\Post(
        path: '/api/v1/prompts',
        summary: 'Создать новый промт',
        description: 'Создаёт новый промт в базе данных.',
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    required: ['name', 'content'],
                    properties: [
                        new OA\Property(property: 'name', type: 'string', example: 'Prompt name'),
                        new OA\Property(property: 'content', type: 'string', example: 'This is the content of the prompt.'),
                        new OA\Property(property: 'tags', type: 'array', items: new OA\Items(type: 'string'), example: ['tag1', 'tag2']),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Промт успешно создан.'),
            new OA\Response(response: 400, description: 'Ошибка валидации данных.'),
            new OA\Response(response: 500, description: 'Ошибка сервера.'),
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

    // Атрибуты для маршрута PUT /prompts/{id}
    #[OA\Put(
        path: '/api/v1/prompts/{id}',
        summary: 'Обновить промт по ID',
        description: 'Обновляет существующий промт по указанному ID.',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID промта', schema: new OA\Schema(type: 'string')),
        ],
        requestBody: new OA\RequestBody(
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'name', type: 'string', example: 'Updated prompt name'),
                        new OA\Property(property: 'content', type: 'string', example: 'Updated content of the prompt.'),
                        new OA\Property(property: 'tags', type: 'array', items: new OA\Items(type: 'string'), example: ['tag1', 'tag3']),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Промт успешно обновлён.'),
            new OA\Response(response: 400, description: 'Ошибка валидации данных.'),
            new OA\Response(response: 404, description: 'Промт не найден.'),
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

    // Атрибуты для маршрута DELETE /prompts/{id}
    #[OA\Delete(
        path: '/api/v1/prompts/{id}',
        summary: 'Удалить промт по ID',
        description: 'Удаляет промт по указанному ID.',
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, description: 'ID промта', schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Промт успешно удалён.'),
            new OA\Response(response: 404, description: 'Промт не найден.'),
            new OA\Response(response: 500, description: 'Ошибка сервера.'),
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