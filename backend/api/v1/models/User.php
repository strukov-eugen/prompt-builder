<?php

namespace PromptBuilder\models;

class User {
    private ?int $id = null;
    private string $name;
    private string $email;
    private string $password;
    private int $age;
    private string $created_at;

    public function __construct(array $data) {
        // Объединяем данные с обязательными полями
        $data = array_merge([
            'name' => '',
            'email' => '',
            'password' => '',
            'age' => 0,
            'created_at' => date("Y-m-d H:i:s"),
        ], $data);
        // Извлекаем данные из массива и устанавливаем их с помощью __set
        foreach ($data as $key => $value) {
            $this->__set($key, $value);
        }
    }

    public function __set(string $property, $value): void {
        if (!property_exists($this, $property)) {
            throw new \Exception("Property '$property' does not exist");
        }

        switch ($property) {
            case 'name':
                if (empty($value) || strlen($value) < 2 || strlen($value) > 50) {
                    throw new \InvalidArgumentException("Name must be between 2 and 50 characters.");
                }
                break;

            case 'email':
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    throw new \InvalidArgumentException("Invalid email format.");
                }
                break;

            case 'password':
                if (strlen($value) !== 60) {
                    throw new \InvalidArgumentException("Password must be 60 characters.");
                }
                break;

            case 'age':
                if (!is_int($value) || $value <= 0) {
                    throw new \InvalidArgumentException("Age must be a positive number.");
                }
                break;
            case 'created_at':
                $date = \DateTime::createFromFormat('Y-m-d H:i:s', $value);
                if (!$date || $date->format('Y-m-d H:i:s') !== $value) {
                    throw new \InvalidArgumentException("Invalid date format for created_at. Expected 'Y-m-d H:i:s'.");
                }
                break;
        }

        $this->$property = $value;
    }

    // Геттеры для доступа к приватным свойствам
    public function getName(): string {
        return $this->name;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function getPassword(): string {
        return $this->password;
    }

    public function getAge(): int {
        return $this->age;
    }

    public function getCreatedAt(): string {
        return $this->created_at;
    }

    public function getId(): ?int {
        return $this->id;
    }
}
