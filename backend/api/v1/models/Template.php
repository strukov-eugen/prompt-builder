<?php

namespace PromptBuilder\models;

class Template {
    private ?int $id = null;
    private string $name;
    private string $description;
    private string $created_at;
    private string $updated_at;

    public function __construct(array $data) {
        $data = array_merge([
            'name' => '',
            'description' => '',
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

            case 'description':
                if (empty($value)) {
                    throw new \InvalidArgumentException("Description cannot be empty.");
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

    public function getDescription(): string {
        return $this->description;
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
}