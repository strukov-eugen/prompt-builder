<?php

// Подключаем автолоадер и необходимые файлы
require_once 'vendor/autoload.php';  // Для загрузки зависимостей через Composer

use PromptBuilder\database\DatabaseConnection;

try {
    // Получаем экземпляр подключения к базе данных
    $db = DatabaseConnection::getInstance();

    // SQL запрос для создания таблицы пользователей
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
    ";

    // Выполняем SQL запрос
    $db->exec($sql);

    echo "Таблица пользователей успешно создана или уже существует.";

} catch (PDOException $e) {
    // Обработка ошибок
    echo "Ошибка при создании таблицы: " . $e->getMessage();
}
