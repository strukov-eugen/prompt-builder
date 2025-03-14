# Используем Node.js для запуска Next.js
FROM node:alpine

WORKDIR /app

# Копируем все файлы проекта
COPY frontend/ /app

# Устанавливаем зависимости и собираем проект
#RUN npm install --force && npm run build

# Открываем порт для Next.js
EXPOSE 3000

# Запуск Next.js сервера
CMD ["npm", "run", "start"]