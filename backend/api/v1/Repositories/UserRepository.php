<?php

namespace PromptBuilder\Repositories;

use PromptBuilder\models\User;
use PromptBuilder\Database\DatabaseConnection;
use PDO;

class UserRepository {

    private PDO $pdo;

    public function __construct() {
        $this->pdo = DatabaseConnection::getInstance();
    }

    // Сохранение пользователя в базе данных
    public function save(User $user): bool {
        try {
            // Подготовка SQL-запроса на вставку данных пользователя
            $stmt = $this->pdo->prepare("INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)");
            return $stmt->execute([
                $user->getName(),
                $user->getEmail(),
                $user->getPassword(),
                $user->getAge()
            ]);
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    // Найти пользователя по email
    public function findByEmail(string $email): ?User {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                return new User($row);
            }
            return null;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    public function updateById(int $userId, array $data): bool {
        $query = "UPDATE users SET ";
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
        $values[] = $userId;
    
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute($values);
    }    

    // Удаление пользователя по ID
    public function deleteById(int $id): bool {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->rowCount() > 0;
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }
}
