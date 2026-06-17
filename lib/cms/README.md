# void-tech CMS

Встроенная CMS для лендингов. SQLite + JWT + shadcn/ui.

## Подключение лендинга к CMS

### 1. Секции (единичные блоки)

```tsx
'use client'
import { useEffect, useState } from 'react'

interface HeroData {
  title: string
  subtitle: string
  backgroundImage: string
}

export default function Hero() {
  const [data, setData] = useState<HeroData | null>(null)

  useEffect(() => {
    fetch('/api/cms/content?id=hero')
      .then(res => res.json())
      .then(section => setData(section.data))
  }, [])

  if (!data) return <Skeleton />

  return <h1>{data.title}</h1>
}
```

### 2. Коллекции (списки)

```tsx
'use client'
import { useEffect, useState } from 'react'

interface Service {
  id: string
  name: string
  price: number
}

export default function Services() {
  const [items, setItems] = useState<Service[]>([])

  useEffect(() => {
    fetch('/api/cms/collections?collection=services')
      .then(res => res.json())
      .then(data => setItems(data.map((item: any) => ({
        id: item.id,
        ...item.data
      }))))
  }, [])

  return items.map(item => <div key={item.id}>{item.name}</div>)
}
```

## CSS для richtext

Лендинг должен поддерживать стили для richtext контента:

```css
.richtext-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.richtext-content ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.richtext-content strong {
  font-weight: 600;
}

.richtext-content em {
  font-style: italic;
}
```

Использование:

```tsx
<div 
  className="richtext-content"
  dangerouslySetInnerHTML={{ __html: data.content }}
/>
```

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/cms/content?id={section}` | Получить секцию |
| PUT | `/api/cms/content` | Обновить секцию |
| PUT | `/api/cms/content/reset?id={section}` | Сбросить к дефолтам |
| GET | `/api/cms/collections?collection={name}` | Получить коллекцию |
| POST | `/api/cms/collections` | Создать элемент |
| PUT | `/api/cms/collections` | Обновить элемент |
| DELETE | `/api/cms/collections` | Удалить элемент |
| PATCH | `/api/cms/collections` | Изменить порядок |
| POST | `/api/cms/upload` | Загрузить изображение |
| POST | `/api/cms/auth/login` | Войти |
| POST | `/api/cms/auth/refresh` | Обновить токен |

## Схема (lib/cms/schema.ts)

### Типы полей

| Тип | Описание | Опции |
|-----|----------|-------|
| `text` | Однострочный текст | `placeholder` |
| `textarea` | Многострочный текст | `rows`, `placeholder` |
| `richtext` | WYSIWYG редактор | `placeholder` |
| `number` | Число | `min`, `max` |
| `boolean` | Переключатель | — |
| `image` | Загрузка изображения | — |
| `json` | JSON редактор | `rows` |
| `date` | Дата | — |

### Пример схемы

```ts
export const schema: CMSSchema = {
  sections: {
    hero: {
      title: { type: 'text', label: 'Заголовок', required: true },
      description: { type: 'richtext', label: 'Описание' },
      image: { type: 'image', label: 'Фон' },
    },
  },
  collections: {
    services: {
      name: { type: 'text', label: 'Название', required: true },
      price: { type: 'number', label: 'Цена', min: 0 },
      popular: { type: 'boolean', label: 'Популярное' },
    },
  },
}
```

## Дефолтные данные (lib/cms/defaults.ts)

При сбросе секции данные берутся из `defaults.ts`. Структура должна соответствовать схеме.

## Файловая структура

```
lib/cms/
  schema.ts      # Схема контента
  defaults.ts    # Начальные данные
  db.ts          # SQLite операции
  auth.ts        # JWT авторизация
  types.ts       # TypeScript типы

app/api/cms/     # API routes
app/admin/       # Админка

data/cms.db      # SQLite база
public/uploads/  # Загруженные файлы
```

## Переменные окружения

```env
CMS_JWT_SECRET=your-secret-key
CMS_ADMIN_PASSWORD=admin123
```

## Авторизация

Админка защищена JWT. Логин: `/admin/login`, пароль из `CMS_ADMIN_PASSWORD`.

Токены:
- Access: 15 минут
- Refresh: 7 дней (автообновление)
