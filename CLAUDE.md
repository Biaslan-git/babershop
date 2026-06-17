# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Проект

Лендинг барбершопа "Black Blade" — single-page приложение на Next.js 16 с секциями: навигация, герой, о нас, услуги, мастера, галерея, отзывы, бронирование, контакты, футер.

## Команды

```bash
npm run dev    # запуск dev-сервера (localhost:3000)
npm run build  # продакшн билд
npm run lint   # ESLint
```

## Стек

- Next.js 16.2.9 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion (анимации)
- Lucide React (иконки)

## Архитектура

- `app/` — App Router: layout.tsx (шрифт Geist, метаданные), page.tsx (композиция секций)
- `components/` — секции лендинга, каждая полностью автономна
- Тёмная тема: фон #050505, текст белый, акцент gold/amber

@AGENTS.md
