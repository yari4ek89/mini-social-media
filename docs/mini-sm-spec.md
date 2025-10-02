
# Mini SM — Front & Back TODO (v1)

> Цель: довести проект до портфолио‑уровня (MVP).

## 1) Frontend (React)

### Технологии
- React + React Router
- Fetch/axios для API
- Context/Redux Toolkit (по вкусу) для auth/user
- Form validation: yup/zod + react-hook-form
- CSS: твоя текущая вёрстка + адаптив + состояния

### Страницы/роуты
- `/` — лента (feed)
- `/login`, `/register`
- `/profile/:username`
- `/settings`
- (опционально) `/post/:id` для отдельного поста

### Компоненты (минимум)
- `Navbar` (поиск, профиль, logout)
- `Sidebar` (профильная карточка, меню)
- `Composer` (форма создания поста: текст + картинки)
- `PostCard` (автор, текст, лайки, комменты, меню)
- `CommentList` + `CommentItem` + `CommentForm`
- `AuthForms` (логин/регистрация)
- `Avatar`, `Button`, `Input`, `Textarea`, `Modal`, `Dropdown`
- `Toast/Alert` для ошибок/успехов
- `ProtectedRoute` (редирект если не авторизован)

### Состояния/флоу
- Auth state: `user`, `token`, `isAuth`
- Feed: список постов, пагинация (infinite scroll/кнопка "Ещё")
- Composer: локальная валидация, предпросмотр изображений
- Like/Unlike: оптимистичное обновление счетчиков
- Комменты: lazy‑load/подгрузка по клику
- Профиль: свои посты, аватар, описание
- Настройки: смена аватара/пароля/описания

### Валидация/UX
- Лимит длины поста (например, 500–1000 символов)
- Лимит размеров/типа файлов (jpg/png/webp, ≤ 5 МБ каждый)
- Лоадеры/скелетоны для ленты и карточек
- Empty‑state (нет постов/друзей/коммьюнити)

### Доступность и адаптив
- Таб‑навигация, aria‑лейблы на кнопках
- Мобильная/планшетная вёрстка

### Работа с ошибками
- Перехват 401 → логаут и редирект на /login
- Тосты для 4xx/5xx, повторная попытка загрузки

### Настройки окружения (frontend)
- `.env` :
  - `VITE_API_URL=https://...`

---

## 2) Backend (Node.js + Express)

### Технологии
- Node.js + Express
- БД: MongoDB (Mongoose) **или** PostgreSQL (Prisma)
- Аутентификация: JWT (access + refresh)
- Хранение файлов: локально (Multer) или облако (Cloudinary/S3)
- Валидация: Joi/zod
- Логирование: morgan + собственные миддлвары
- Безопасность: helmet, cors, rate‑limit, bcrypt

### Модели/схемы (MVP)
**User**
- `_id`, `username` (uniq), `email` (uniq), `passwordHash`
- `avatarUrl`, `bio`, `createdAt`, `updatedAt`

**Post**
- `_id`, `authorId`, `text`, `images[]`, `likesCount`
- `commentsCount`, `createdAt`, `updatedAt`

**Like**
- `_id`, `postId`, `userId`, `createdAt` (уникальный составной индекс postId+userId)

**Comment**
- `_id`, `postId`, `authorId`, `text`, `createdAt`

### REST API (черновик контракта)
**Auth**
- `POST /api/auth/register` → {username, email, password} → 201 + user
- `POST /api/auth/login` → {email, password} → 200 + {access, refresh, user}
- `POST /api/auth/refresh` → {refresh} → 200 + {access}
- `POST /api/auth/logout` → 204

**Users**
- `GET /api/users/me` (JWT)
- `PATCH /api/users/me` (bio, avatarUrl) (JWT)
- `GET /api/users/:username` — профиль и список постов (пагинация)

**Posts**
- `GET /api/posts` — лента: `?page=&limit=`
- `POST /api/posts` (JWT, multipart) — создать (текст + images[])
- `GET /api/posts/:id`
- `DELETE /api/posts/:id` (автор или админ)

**Likes**
- `POST /api/posts/:id/like` (JWT)
- `DELETE /api/posts/:id/like` (JWT)

**Comments**
- `GET /api/posts/:id/comments?cursor=`
- `POST /api/posts/:id/comments` (JWT) — {text}
- `DELETE /api/comments/:id` (автор или админ)

### Ответы (пример, без форматирования)
POST /api/posts → {
  "id": "p_123",
  "author": {"id":"u_1","username":"yaroslav","avatarUrl":"/a.jpg"},
  "text": "Hello Mini SM!",
  "images": ["/uploads/p1.jpg"],
  "likesCount": 0,
  "commentsCount": 0,
  "createdAt": "2025-09-16T13:00:00Z"
}

### Ошибки (единый формат)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "text is required",
    "fields": {"text":"required"}
  }
}

### Безопасность/политики
- Пароль ≥ 8 символов, bcrypt 10–12 rounds
- JWT access ~15m, refresh ~7d, хранение refresh в httpOnly cookie
- Проверка размера/типа загружаемых файлов
- Rate limit: auth/комментарии/лайки
- CORS по списку доменов

### Окружение (backend)
- `.env` :
  - `PORT=4000`
  - `DATABASE_URL=...`
  - `JWT_ACCESS_SECRET=...`
  - `JWT_REFRESH_SECRET=...`
  - `UPLOAD_DIR=./uploads`
  - `CLOUDINARY_*` (если нужно)

### Структура проекта (пример, Express + Mongo)
/src
  /config
  /middlewares
  /modules
    /auth
    /users
    /posts
    /likes
    /comments
  /utils
  app.ts|js
/index.ts|js

### Тестовые пользователи/данные (seed)
- Пользователь: `test@test.com` / `password123`
- 10 постов фейковых (lorem), 2–3 с картинками

---

## 3) Синхронизация фронт ↔ бэк
- Контракт API сохранён в `/docs/api.md`
- Типы/интерфейсы ответа вынесены (можно сгенерировать через OpenAPI)
- Обработка 401/403 всеми клиентскими запросами
- Пагинация: сервер отдаёт `page/limit/total` или `cursor/nextCursor`

---

## 4) Деплой (MVP)
- Front: Vercel/Netlify
- Back: Render/Fly.io/Railway
- DB: Mongo Atlas или Railway Postgres
- ENV: секреты только через панели провайдера
- CORS: домены фронта

---

## 5) Бэклог v1.1 (после MVP)
- Роли: admin/mod
- Репосты/сохранённые посты
- Уведомления
- Поиск по постам и пользователям
- Коммьюнити/группы
