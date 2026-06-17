# Black Blade Barbershop

Лендинг премиум барбершопа с встроенной CMS для редактирования контента.

## Стек

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion** — анимации
- **SQLite** (better-sqlite3) — хранение данных
- **TipTap** — WYSIWYG редактор
- **shadcn/ui** — компоненты админки

## Запуск

```bash
npm install
npm run dev
```

Лендинг: http://localhost:3000  
Админка: http://localhost:3000/admin

## Админка (CMS)

### Вход

Пароль по умолчанию: `admin123`

Для смены пароля установите переменную окружения:

```bash
CMS_ADMIN_PASSWORD=your_secure_password
```

### Структура

**Секции** — единичные блоки контента:
- Hero — главный экран
- О нас — информация о компании
- Контакты — адрес, телефон, часы работы
- Футер — подвал сайта
- SEO — мета-теги

**Коллекции** — списки элементов:
- Услуги — название, цена, длительность
- Мастера — имя, фото, специализация
- Отзывы — клиент, текст, рейтинг
- Галерея — фото работ
- Соцсети — ссылки на Instagram, Telegram и т.д.
- Навигация — пункты меню

### Возможности

- Drag-n-drop сортировка элементов коллекций
- WYSIWYG редактор для форматированного текста
- Загрузка изображений
- Дублирование элементов
- Поиск по коллекциям
- Сброс к начальным значениям
- Удобный редактор расписания (часы работы)

## API

### Секции

```
GET  /api/cms/content?id=hero     — получить секцию
PUT  /api/cms/content             — обновить секцию
PUT  /api/cms/content/reset?id=X  — сбросить к дефолту
```

### Коллекции

```
GET    /api/cms/collections?collection=services  — список
POST   /api/cms/collections                      — создать
PUT    /api/cms/collections                      — обновить
DELETE /api/cms/collections?id=X                 — удалить
PUT    /api/cms/collections/reorder              — сортировка
```

### Загрузка файлов

```
POST /api/cms/upload  — загрузить изображение (multipart/form-data)
```

## Структура проекта

```
app/
  admin/           — страницы админки
  api/cms/         — API эндпоинты
  page.tsx         — лендинг

components/
  admin/           — компоненты админки
  ui/              — shadcn компоненты
  Hero.tsx         — секции лендинга
  ...

lib/cms/
  db.ts            — работа с SQLite
  schema.ts        — схема полей
  defaults.ts      — начальные данные
  auth.ts          — JWT авторизация

data/
  cms.db           — база данных (создаётся автоматически)

public/uploads/    — загруженные изображения
```

## Добавление новых полей

1. Добавить поле в схему (`lib/cms/schema.ts`)
2. Добавить дефолтное значение (`lib/cms/defaults.ts`)
3. Обновить компонент лендинга

Типы полей: `text`, `textarea`, `richtext`, `number`, `boolean`, `image`, `json`, `schedule`

## Деплой

```bash
npm run build
npm start
```

База данных SQLite хранится в `data/cms.db`. При деплое убедитесь, что папка `data/` доступна для записи.

## Лицензия

MIT
