import Database from 'better-sqlite3'
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs'

const DB_PATH = join(process.cwd(), 'data', 'cms.db')

if (!existsSync(join(process.cwd(), 'data'))) {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true })
}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS collection_items (
    id TEXT PRIMARY KEY,
    collection TEXT NOT NULL,
    item_order INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_collection_items_collection
    ON collection_items(collection);

  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS preferences (
    id TEXT PRIMARY KEY DEFAULT 'default',
    accent_hue INTEGER NOT NULL DEFAULT 210,
    theme TEXT NOT NULL DEFAULT 'dark'
  );

  INSERT OR IGNORE INTO preferences (id) VALUES ('default');
`)

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const now = new Date().toISOString()

const sections = {
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
}

const services = [
  { name: 'Мужская стрижка', description: 'Классическая или современная стрижка с консультацией мастера', price: 2500, duration: 45, popular: true },
  { name: 'Стрижка + Борода', description: 'Полный уход: стрижка, моделирование бороды, укладка', price: 4000, duration: 75, popular: true },
  { name: 'Оформление бороды', description: 'Моделирование, стрижка и уход за бородой', price: 1800, duration: 30, popular: false },
  { name: 'Королевское бритьё', description: 'Классическое бритьё опасной бритвой с горячими полотенцами', price: 2200, duration: 40, popular: false },
  { name: 'Детская стрижка', description: 'Для юных джентльменов до 12 лет', price: 1500, duration: 30, popular: false },
  { name: 'Камуфляж седины', description: 'Натуральное тонирование седых волос', price: 1500, duration: 25, popular: false },
]

const masters = [
  { name: 'Александр Волков', role: 'Основатель, Top Barber', experience: '12 лет', specialty: 'Классические стрижки, Опасная бритва', initials: 'АВ' },
  { name: 'Дмитрий Орлов', role: 'Senior Barber', experience: '8 лет', specialty: 'Fade, Современные текстуры', initials: 'ДО' },
  { name: 'Максим Соколов', role: 'Senior Barber', experience: '7 лет', specialty: 'Бороды, Камуфляж седины', initials: 'МС' },
  { name: 'Игорь Лебедев', role: 'Barber', experience: '5 лет', specialty: 'Креативные стрижки, Hair Tattoo', initials: 'ИЛ' },
]

const reviews = [
  { name: 'Михаил К.', text: 'Хожу к Александру уже три года. Лучший барбершоп в Москве — качество, атмосфера, внимание к деталям. Рекомендую всем.', rating: 5, service: 'Стрижка + Борода' },
  { name: 'Андрей С.', text: 'Приятно удивлён уровнем сервиса. Мастера реально слушают что хочешь и делают именно так. Плюс отличный виски в подарок.', rating: 5, service: 'Королевское бритьё' },
  { name: 'Денис В.', text: 'Дмитрий сделал идеальный fade. Теперь только сюда. Цены выше среднего, но качество того стоит.', rating: 5, service: 'Мужская стрижка' },
]

const socials = [
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'Telegram', href: 'https://t.me' },
  { name: 'WhatsApp', href: 'https://wa.me' },
]

const navigation = [
  { label: 'О нас', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Мастера', href: '#masters' },
  { label: 'Работы', href: '#gallery' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contact' },
]

console.log('Seeding sections...')
const sectionStmt = db.prepare(`
  INSERT OR REPLACE INTO sections (id, data, updated_at) VALUES (?, ?, ?)
`)
for (const [id, data] of Object.entries(sections)) {
  sectionStmt.run(id, JSON.stringify(data), now)
  console.log(`  - ${id}`)
}

function seedCollection(name: string, items: Record<string, unknown>[]) {
  console.log(`Seeding ${name}...`)
  const stmt = db.prepare(`
    INSERT INTO collection_items (id, collection, item_order, data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  items.forEach((item, i) => {
    stmt.run(generateId(), name, i, JSON.stringify(item), now, now)
    console.log(`  - ${(item as {name?: string, label?: string}).name || (item as {name?: string, label?: string}).label}`)
  })
}

db.prepare('DELETE FROM collection_items').run()

seedCollection('services', services)
seedCollection('masters', masters)
seedCollection('reviews', reviews)
seedCollection('socials', socials)
seedCollection('navigation', navigation)

console.log('\nDone! Database seeded at:', DB_PATH)
db.close()
