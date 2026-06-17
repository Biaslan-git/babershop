export const defaultSections: Record<string, Record<string, unknown>> = {
  hero: {
    tag: 'Премиум Барбершоп Москва',
    title: 'Мастерство',
    subtitle: 'в каждом движении',
    description: 'Для мужчин, которые ценят качество. Стрижки, бороды и уход от лучших мастеров города.',
    buttonPrimary: 'Записаться онлайн',
    buttonSecondary: 'Смотреть услуги',
    backgroundImage: '/hero-bg.jpg',
  },
  about: {
    tag: 'О нас',
    title: 'Философия Black Blade',
    content: `Black Blade — это не просто барбершоп. Это место, где традиции мужского мастерства сочетаются с современным подходом к стилю.

Мы верим, что каждый мужчина заслуживает индивидуального подхода. Наши мастера не просто стригут — они создают образ, который подчёркивает вашу индивидуальность.`,
    quote: 'Качество — это не роскошь, а стандарт',
    stats: [
      { value: '8+', label: 'Лет опыта' },
      { value: '12K', label: 'Клиентов' },
      { value: '6', label: 'Мастеров' },
    ],
  },
  contact: {
    title: 'Контакты',
    address: 'Москва, ул. Пречистенка, 15',
    phone: '+7 (495) 123-45-67',
    email: 'hello@blackblade.ru',
    hours: [
      { day: 'Пн-Пт', time: '10:00 — 22:00' },
      { day: 'Сб-Вс', time: '10:00 — 20:00' },
    ],
  },
  footer: {
    logo: 'BLACK BLADE',
    tagline: 'Премиум барбершоп в Москве',
    copyright: '© 2024 Black Blade Barbershop. Все права защищены.',
  },
  booking: {
    title: 'Записаться онлайн',
    description: 'Заполните форму и мы свяжемся с вами для подтверждения записи',
    phone: '+7 (495) 123-45-67',
  },
  seo: {
    title: 'Black Blade — Премиум Барбершоп в Москве',
    description: 'Мужские стрижки, оформление бороды и уход от лучших мастеров. Запишитесь онлайн или по телефону.',
    keywords: 'барбершоп, барбер, мужская стрижка, борода, москва, премиум',
    ogImage: '/hero-bg.jpg',
    favicon: '',
  },
}

export function getDefaultSection(id: string): Record<string, unknown> | null {
  return defaultSections[id] || null
}
