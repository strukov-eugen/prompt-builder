FROM php:8.3-fpm

# Устанавливаем системные зависимости, включая утилиты для отладки, необходимые библиотеки и инструменты
RUN apt-get update && apt-get install -y \
    procps \
    curl \
    nano \
    unzip \
    git \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем PHP расширения
RUN docker-php-ext-install pdo pdo_mysql zip

# Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Настройка рабочей директории
WORKDIR /var/www/backend

# Копирование файлов в контейнер
COPY backend/ /var/www/backend

EXPOSE 9000

# Запуск PHP-FPM
CMD ["php-fpm"]