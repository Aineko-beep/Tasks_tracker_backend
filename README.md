# Tasks Tracker Backend

Backend приложение для управления задачами, построенное на Express.js и MySQL с использованием Sequelize ORM.

## Структура базы данных

### Таблица Users

- `id` (INT) - Уникальный идентификатор пользователя (первичный ключ, автоинкремент)
- `login` (VARCHAR(255)) - Email пользователя (уникальный, обязательный)
- `recovery_code` (VARCHAR(100)) - Код восстановления доступа (может быть пустым)
- `recovery_data` (TEXT) - Дополнительные данные для восстановления (может быть пустым)
- `created_at` (DATETIME) - Дата и время создания записи (автоматически)
- `updated_at` (DATETIME) - Дата и время последнего обновления (автоматически)

### Таблица Tasks

- `id` (INT) - Уникальный идентификатор задачи (первичный ключ, автоинкремент)
- `title` (VARCHAR(255)) - Заголовок задачи (обязательный)
- `description` (TEXT) - Описание задачи (необязательный)
- `data` (DATETIME) - Дата, связанная с задачей (может быть пустым)
- `status` (ENUM) - Статус задачи: 'new', 'in_progress', 'completed', 'cancelled' (обязательный)
- `userId` (INT) - Внешний ключ на таблицу Users
- `created_at` (DATETIME) - Дата и время создания записи (автоматически)
- `updated_at` (DATETIME) - Дата и время последнего обновления (автоматически)

## Установка и настройка

1. Установите зависимости:
   [//]: # (README обновлён автоматически агентом — содержит инструкции по установке, запуску и тестированию)

# Tasks Tracker Backend

Локальное руководство по установке и проверке работоспособности backend-приложения.

Технологии: Node.js, Express.js, Sequelize, MySQL, JWT.

## Требования

- Node.js v16+
- MySQL сервер

## Быстрая установка

1. Установите зависимости:

   npm install

2. Создайте (при необходимости) файл `.env` в корне и задайте переменные (опционально):

   DB_NAME=tasks_db
   DB_USER=root
   DB_PASSWORD=root
   DB_HOST=127.0.0.1
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret

Если переменные не заданы, приложение использует `db/config.json` для режима `development`.

## Запуск

- В режиме разработки (nodemon):

  npm run dev

- В продакшн-режиме:

  npm start

## Маршруты (основные)

Базовый префикс: `/api`

- POST /api/auth/register — регистрация

  - Body: { "login": "user@example.com" }
  - Ответ: 201 Created

- POST /api/auth/login — вход

  - Body: { "login": "user@example.com" }
  - Ответ: 200 OK, { token, user }

- GET /api/auth/me — информация о текущем пользователе (требует Authorization: Bearer <token>)

- GET /api/users — список пользователей
- GET /api/tasks — список задач (с привязкой к пользователям)

