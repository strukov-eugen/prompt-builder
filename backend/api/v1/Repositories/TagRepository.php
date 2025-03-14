<?php

namespace PromptBuilder\Repositories;

use PromptBuilder\Models\Tag;
use PromptBuilder\Database\DatabaseConnection;
use PDO;

class TagRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = DatabaseConnection::getInstance();
    }

    // Сохранение Tag в базе данных
    public function save(Tag $tag): bool {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO tags (name) VALUES (?)");
            return $stmt->execute([$tag->getName()]);
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Получение Tag по ID
    public function findById(int $id): ?Tag {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM tags WHERE id = ?");
            $stmt->execute([$id]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                return new Tag($row);
            }
            return null;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Обновление Tag по ID
    public function updateById(int $id, array $data): bool {
        $query = "UPDATE tags SET ";
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

    // Удаление Tag по ID
    public function deleteById(int $id): bool {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM tags WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }
}