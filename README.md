# Dental Clinic Backend

Backend API для автоматизации работы стоматологической клиники: хранение пациентов, сотрудников, приемов, услуг и оплат.

## Какие задачи решает проект

- Ведение карточек пациентов.
- Управление пользователями системы (администратор, врач, ассистент).
- Планирование и сопровождение приемов.
- Каталог стоматологических услуг с ценой и длительностью.
- Фиксация услуг, оказанных в рамках конкретного приема.
- Учет оплат по приемам (сумма, способ, статус).

## Технологии

- Node.js + TypeScript
- Express 5
- PostgreSQL (`pg`)
- Zod (валидация входных данных)
- bcrypt (хеширование паролей)
- helmet, cors (базовая безопасность HTTP)
- ESLint + Prettier

## Структура проекта

```text
.
├─ src/
│  ├─ index.ts                     # Точка входа, запуск HTTP-сервера
│  ├─ app.ts                       # Конфигурация Express и подключение роутов
│  ├─ db.ts                        # Подключение к PostgreSQL через Pool
│  ├─ routes/                      # Маршруты API по сущностям
│  │  ├─ patient.ts
│  │  ├─ user.ts
│  │  ├─ visit.ts
│  │  ├─ service.ts
│  │  ├─ payment.ts
│  │  └─ visit_service.ts
│  ├─ controllers/                 # CRUD-логика и SQL-запросы
│  │  ├─ patient.controller.ts
│  │  ├─ user.controller.ts
│  │  ├─ visit.controller.ts
│  │  ├─ service.controller.ts
│  │  ├─ payment.controller.ts
│  │  └─ visit_service.controller.ts
│  ├─ schemas/                     # Zod-схемы валидации
│  │  ├─ patient.schema.ts
│  │  ├─ user.schema.ts
│  │  ├─ visit.schema.ts
│  │  ├─ service.schema.ts
│  │  ├─ payment.schema.ts
│  │  └─ visit_service.schema.ts
│  └─ types/
│     └─ types.ts                  # Доменные типы и enum-значения
├─ package.json
├─ tsconfig.json
├─ .eslintrc.js
├─ .prettierrc
└─ .gitignore
```

## Архитектура

- `routes` принимают HTTP-запросы и вызывают контроллеры.
- `controllers` валидируют тело запроса через `schemas`, выполняют SQL в PostgreSQL и возвращают JSON.
- `schemas` описывают контракт данных для `create`/`update`.
- `db.ts` создает единый `Pool` по `DATABASE_URL`.

Паттерн единый для всех модулей: `POST/GET/GET by id/PUT/DELETE`.

## API эндпоинты

Базовый префикс: `/api`.

- Пациенты: `/patients`
  - `POST /api/patients`
  - `GET /api/patients`
  - `GET /api/patients/:id`
  - `PUT /api/patients/:id`
  - `DELETE /api/patients/:id`
- Пользователи: `/users`
  - `POST /api/users`
  - `GET /api/users`
  - `GET /api/users/:id`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`
- Приемы: `/visits`
  - `POST /api/visits`
  - `GET /api/visits`
  - `GET /api/visits/:id`
  - `PUT /api/visits/:id`
  - `DELETE /api/visits/:id`
- Услуги: `/services`
  - `POST /api/services`
  - `GET /api/services`
  - `GET /api/services/:id`
  - `PUT /api/services/:id`
  - `DELETE /api/services/:id`
- Платежи: `/payments`
  - `POST /api/payments`
  - `GET /api/payments`
  - `GET /api/payments/:id`
  - `PUT /api/payments/:id`
  - `DELETE /api/payments/:id`
- Связь прием-услуга: `/visit_service`
  - `POST /api/visit_service`
  - `GET /api/visit_service`
  - `GET /api/visit_service/:id`
  - `PUT /api/visit_service/:id`
  - `DELETE /api/visit_service/:id`

## Модель данных (ожидаемая схема PostgreSQL)

Проект ожидает наличие таблиц:

- `patient`: `id`, `first_name`, `last_name`, `phone`, `birth_date`, `created_at`, `updated_at`
- `"user"`: `id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`
- `visit`: `id`, `patient_id`, `doctor_id`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`
- `service`: `id`, `name`, `description`, `code`, `price`, `duration`, `created_at`, `updated_at`
- `visit_service`: `id`, `visit_id`, `service_id`, `quantity`, `price_at_time`, `created_at`, `updated_at`
- `payment`: `id`, `visit_id`, `amount`, `payment_method`, `status`, `created_at`, `updated_at`

Используемые enum-значения:

- `role`: `admin | doctor | assistant`
- `visit.status`: `scheduled | in_progress | completed | cancelled | no_show`
- `payment.payment_method`: `cash | card | transfer | insurance`
- `payment.status`: `pending | paid | failed | refunded`

## Валидация

Входные данные на `POST`/`PUT` валидируются через Zod:

- UUID для идентификаторов.
- Проверка email.
- Минимальная длина строковых полей.
- Положительные/неотрицательные числовые ограничения.
- Для приема: `end_time >= start_time`.

## Переменные окружения

Файл `.env`:

```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/dental_clinic_db
JWT_SECRET=your_jwt_secret
```

Обязательно для запуска:

- `PORT`
- `DATABASE_URL`

`JWT_SECRET` присутствует в конфиге, но в текущем коде JWT-аутентификация еще не подключена.

## Запуск проекта

1. Установить зависимости:
   ```bash
   npm install
   ```
2. Подготовить PostgreSQL и создать таблицы.
3. Настроить `.env`.
4. Запустить в режиме разработки:
   ```bash
   npm run dev
   ```

Скрипты:

- `npm run dev` - запуск через `tsx` с watch.
- `npm run build` - компиляция TypeScript.
- `npm run start` - запуск собранного приложения.
- `npm run lint` - проверка линтером.
