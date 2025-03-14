<?php

namespace PromptBuilder\Repositories;

use PromptBuilder\Models\Prompt;
use PromptBuilder\Database\DatabaseConnection;
use PDO;

class PromptRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = DatabaseConnection::getInstance();
    }

    // Сохранение Prompt в базе данных
    public function save(Prompt $prompt): bool {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO prompts (name, content, variables, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
            return $stmt->execute([
                $prompt->getName(),
                $prompt->getContent(),
                $prompt->getVariables(),
                $prompt->getCreatedAt(),
                $prompt->getUpdatedAt()
            ]);
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Получение Prompt по ID
    public function findById(int $id): ?Prompt {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM prompts WHERE id = ?");
            $stmt->execute([$id]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                return new Prompt($row);
            }
            return null;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Обновление Prompt по ID
    public function updateById(int $id, array $data): bool {
        $query = "UPDATE prompts SET ";
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $values[] = $value;
        }

        if (empty($fields)) {
            throw new \Exception("No data provided for update");
        }

        $query .= implode(", ", $fields) . " WHERE id = ?";
        $values[] = $id;

        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($values);
    }

    // Удаление Prompt по ID
    public function deleteById(int $id): bool {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM prompts WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    public function findAllWithFilters($search, $tags, $sortBy, $sortOrder, $page, $limit) {
        // Базовый SQL-запрос с фильтрацией по имени и контенту
        $query = "
            SELECT DISTINCT p.* 
            FROM prompts p
            LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE (p.name LIKE ? OR p.content LIKE ?)
        ";
    
        // Добавление фильтрации по тегам, если теги заданы
        if (!empty($tags)) {
            $query .= " AND t.id IN (" . implode(",", array_map('intval', $tags)) . ")";
        }
    
        // Сортировка по заданным параметрам
        $query .= " ORDER BY $sortBy $sortOrder";
    
        // Пагинация
        $offset = ($page - 1) * $limit;
        $query .= " LIMIT ?, ?";
    
        // Подготовка и выполнение запроса
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['%' . $search . '%', '%' . $search . '%', $offset, $limit]);
    
        // Получение результатов
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Возвращаем массив объектов Prompt
        return array_map(function ($row) {
            return new Prompt($row);
        }, $rows);
    }
    
    public function countAllWithFilters($search, $tags) {
        $query = "SELECT COUNT(*) FROM prompts WHERE name LIKE ? OR content LIKE ?";
        if (!empty($tags)) {
            $query .= " AND tags IN (" . implode(",", array_map('intval', $tags)) . ")";
        }
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(['%' . $search . '%', '%' . $search . '%']);
        
        return $stmt->fetchColumn();
    }

}