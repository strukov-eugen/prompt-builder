<?php

namespace PromptBuilder\models;

class Tag {
    private ?int $id = null;
    private string $name;

    public function __construct(array $data) {
        $data = array_merge([
            'name' => '',
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
                if (empty($value) || strlen($value) < 2 || strlen($value) > 50) {
                    throw new \InvalidArgumentException("Name must be between 2 and 50 characters.");
                }
                break;
        }

        $this->$property = $value;
    }

    // Геттеры
    public function getName(): string {
        return $this->name;
    }

    public function getId(): ?int {
        return $this->id;
    }
}