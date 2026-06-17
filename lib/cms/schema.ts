import type { CMSSchema } from './types'

export const schema: CMSSchema = {
  sections: {
    hero: {
      tag: { type: 'text', label: 'Тег', placeholder: 'Премиум Барбершоп' },
      title: { type: 'text', label: 'Заголовок', required: true },
      subtitle: { type: 'text', label: 'Подзаголовок' },
      description: { type: 'textarea', label: 'Описание', rows: 3 },
      backgroundImage: { type: 'image', label: 'Фоновое изображение' },
      buttonPrimary: { type: 'text', label: 'Кнопка 1' },
      buttonSecondary: { type: 'text', label: 'Кнопка 2' },
    },

    about: {
      tag: { type: 'text', label: 'Тег' },
      title: { type: 'text', label: 'Заголовок', required: true },
      content: { type: 'richtext', label: 'Текст' },
      quote: { type: 'text', label: 'Цитата' },
      stats: { type: 'json', label: 'Статистика' },
      image: { type: 'image', label: 'Изображение' },
    },

    contact: {
      title: { type: 'text', label: 'Заголовок' },
      address: { type: 'text', label: 'Адрес', required: true },
      phone: { type: 'text', label: 'Телефон', required: true },
      email: { type: 'text', label: 'Email' },
      hours: { type: 'schedule', label: 'Часы работы' },
      mapCoordinates: { type: 'text', label: 'Координаты карты' },
    },

    footer: {
      logo: { type: 'text', label: 'Логотип' },
      tagline: { type: 'text', label: 'Слоган' },
      copyright: { type: 'text', label: 'Копирайт' },
    },

    booking: {
      title: { type: 'text', label: 'Заголовок' },
      description: { type: 'textarea', label: 'Описание' },
      phone: { type: 'text', label: 'Телефон для связи' },
    },

    seo: {
      title: { type: 'text', label: 'Заголовок страницы', required: true, placeholder: 'Black Blade — Премиум Барбершоп' },
      description: { type: 'textarea', label: 'Описание', rows: 3, placeholder: 'Мужские стрижки и уход за бородой в Москве' },
      keywords: { type: 'text', label: 'Ключевые слова', placeholder: 'барбершоп, стрижка, борода, москва' },
      ogImage: { type: 'image', label: 'OG Image (1200x630)' },
      favicon: { type: 'image', label: 'Favicon' },
    },
  },

  collections: {
    services: {
      name: { type: 'text', label: 'Название', required: true },
      description: { type: 'textarea', label: 'Описание' },
      price: { type: 'number', label: 'Цена', required: true, min: 0 },
      duration: { type: 'number', label: 'Длительность (мин)', min: 0 },
      popular: { type: 'boolean', label: 'Популярное' },
      icon: { type: 'text', label: 'Иконка' },
    },

    masters: {
      name: { type: 'text', label: 'Имя', required: true },
      role: { type: 'text', label: 'Должность' },
      experience: { type: 'text', label: 'Опыт' },
      specialty: { type: 'text', label: 'Специализация' },
      photo: { type: 'image', label: 'Фото' },
      initials: { type: 'text', label: 'Инициалы' },
    },

    reviews: {
      name: { type: 'text', label: 'Имя клиента', required: true },
      text: { type: 'richtext', label: 'Отзыв', required: true },
      rating: { type: 'number', label: 'Рейтинг', min: 1, max: 5 },
      service: { type: 'text', label: 'Услуга' },
      date: { type: 'date', label: 'Дата' },
    },

    socials: {
      name: { type: 'text', label: 'Название', required: true },
      href: { type: 'text', label: 'Ссылка', required: true },
      icon: { type: 'text', label: 'Иконка' },
    },

    gallery: {
      title: { type: 'text', label: 'Название' },
      category: { type: 'text', label: 'Категория' },
      image: { type: 'image', label: 'Изображение', required: true },
    },

    navigation: {
      label: { type: 'text', label: 'Текст', required: true },
      href: { type: 'text', label: 'Ссылка', required: true },
    },
  },
}

export function getSectionSchema(sectionId: string) {
  return schema.sections[sectionId]
}

export function getCollectionSchema(collectionName: string) {
  return schema.collections[collectionName]
}

export function getSectionIds() {
  return Object.keys(schema.sections)
}

export function getCollectionNames() {
  return Object.keys(schema.collections)
}
