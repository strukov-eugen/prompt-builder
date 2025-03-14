<?php

namespace PromptBuilder\Repositories;

use PromptBuilder\Models\Template;
use PromptBuilder\Database\DatabaseConnection;
use PDO;

class TemplateRepository {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = DatabaseConnection::getInstance();
    }

    // Сохранение Template в базе данных
    public function save(Template $template): bool {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO templates (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)");
            return $stmt->execute([
                $template->getName(),
                $template->getDescription(),
                $template->getCreatedAt(),
                $template->getUpdatedAt()
            ]);
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Получение Template по ID
    public function findById(int $id): ?Template {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM templates WHERE id = ?");
            $stmt->execute([$id]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                return new Template($row);
            }
            return null;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Обновление Template по ID
    public function updateById(int $id, array $data): bool {
        $query = "UPDATE templates SET ";
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

    // Удаление Template по ID
    public function deleteById(int $id): bool {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM templates WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }
}