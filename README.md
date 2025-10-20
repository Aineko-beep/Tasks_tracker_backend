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

```bash
npm install
```

2. Настройте базу данных MySQL:

   - Создайте базу данных `tasks_tracker_dev`
   - Обновите данные подключения в `config/config.json` при необходимости

3. Запустите миграции для создания таблиц:

```bash
npx sequelize-cli db:migrate
```

4. Запустите сервер:

```bash
npm start
```

## API Endpoints

### Основные маршруты

- `GET /` - Проверка работы сервера

### Пользователи

- `GET /api/users` - Получить список всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users` - Создать нового пользователя
- `PATCH /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Задачи

- `GET /api/tasks` - Получить список всех задач с информацией о пользователях
- `GET /api/tasks/:id` - Получить задачу по ID
- `POST /api/tasks` - Создать новую задачу
- `PATCH /api/tasks/:id` - Обновить задачу
- `DELETE /api/tasks/:id` - Удалить задачу

### Аутентификация

- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Получить информацию о текущем пользователе
- `POST /api/auth/password/forgot` - Восстановление пароля
- `POST /api/auth/password/reset` - Сброс пароля

## Примеры использования

### Создание пользователя

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"login": "user@example.com"}'
```

### Создание задачи

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новая задача",
    "description": "Описание задачи",
    "status": "new",
    "userId": 1
  }'
```

### Получение всех задач с пользователями

```bash
curl http://localhost:5000/api/tasks
```

### Тестирование API

```bash
npm install axios  # если не установлен
node test_api.js   # запуск тестов
```

## Технологии

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- CORS
- Morgan (логирование)
  Репозиторий содержит серверную часть приложения для удобного и эффективного отслеживания задач. Бэкенд реализует API для создания, редактирования, удаления и получения задач с поддержкой авторизации пользователей, управления статусами и приоритетами.
