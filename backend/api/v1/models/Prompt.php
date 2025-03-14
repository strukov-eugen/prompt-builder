<?php

namespace PromptBuilder\models;

use JsonSerializable;

class Prompt implements JsonSerializable {
    private ?int $id = null;
    private string $name;
    private string $content;
    private string $variables;  // Храним переменные как JSON строку
    private string $created_at;
    private string $updated_at;

    public function __construct(array $data) {
        $data = array_merge([
            'name' => '',
            'content' => '',
            'variables' => '[]',  // Пустой JSON массив
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s"),
        ], $data);

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
                if (empty($value) || strlen($value) < 2 || strlen($value) > 100) {
                    throw new \InvalidArgumentException("Name must be between 2 and 100 characters.");
                }
                break;

            case 'content':
                if (empty($value)) {
                    throw new \InvalidArgumentException("Content cannot be empty.");
                }
                break;

            case 'variables':
                if (!is_array(json_decode($value, true))) {
                    throw new \InvalidArgumentException("Invalid JSON format for variables.");
                }
                break;

            case 'created_at':
            case 'updated_at':
                $date = \DateTime::createFromFormat('Y-m-d H:i:s', $value);
                if (!$date || $date->format('Y-m-d H:i:s') !== $value) {
                    throw new \InvalidArgumentException("Invalid date format. Expected 'Y-m-d H:i:s'.");
                }
                break;
        }

        $this->$property = $value;
    }

    // Геттеры
    public function getName(): string {
        return $this->name;
    }

    public function getContent(): string {
        return $this->content;
    }

    public function getVariables(): string {
        return $this->variables;
    }

    public function getCreatedAt(): string {
        return $this->created_at;
    }

    public function getUpdatedAt(): string {
        return $this->updated_at;
    }

    public function getId(): ?int {
        return $this->id;
    }

    // Метод jsonSerialize для преобразования объекта в формат JSON
    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'content' => $this->content,
            'variables' => json_decode($this->variables, true), // Преобразуем переменные обратно в массив
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }

}