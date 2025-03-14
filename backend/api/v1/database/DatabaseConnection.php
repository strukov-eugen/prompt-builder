<?php

namespace PromptBuilder\database;

use PDO;
use PDOException;

class DatabaseConnection {
    private static ?PDO $instance = null;

    private function __construct() {
        $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $db = $_ENV['DB_DATABASE'] ?? 'test_db';
        $user = $_ENV['DB_USERNAME'] ?? 'root';
        $pass = $_ENV['DB_PASSWORD'] ?? '';
        $charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            self::$instance = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            die("Database connection error: " . $e->getMessage());
        }
    }

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            new self();
        }
        return self::$instance;
    }

    private function __clone() {}
    public function __wakeup() {}
}