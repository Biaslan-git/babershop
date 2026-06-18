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
    title: 'Твой стиль',
    subtitle: 'начинается здесь',
    description: 'Не просто стрижка — полная трансформация образа. Уходишь другим человеком.',
    buttonPrimary: 'Записаться сейчас',
    buttonSecondary: 'Узнать цены',
    backgroundImage: '/hero-bg.jpg',
  },
  about: {
    tag: 'О нас',
    title: 'Философия Black Blade',
    content: `Мы не стрижём — мы создаём. Каждый клиент уходит с ощущением, что выглядит на миллион.

За 8 лет через нас прошли 12 000 мужчин. Возвращаются 87%. Потому что здесь не торопят, слушают и делают так, как нужно именно тебе.

Никаких конвейеров. Только индивидуальный подход и мастера, влюблённые в своё дело.`,
    quote: 'Выглядеть дорого — это не про деньги. Это про детали.',
    stats: [
      { value: '8+', label: 'Лет опыта' },
      { value: '12K', label: 'Клиентов' },
      { value: '87%', label: 'Возвращаются' },
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
    copyright: '© 2026 Black Blade Barbershop. Все права защищены.',
  },
  booking: {
    title: 'Запишись сейчас',
    description: 'Оставь номер — перезвоним за 5 минут и подберём удобное время',
    phone: '+7 (495) 123-45-67',
  },
}

const services = [
  { name: 'Мужская стрижка', description: 'Стрижка, которая держит форму 3 недели. Укладка и консультация по уходу в подарок.', price: 2500, duration: 45, popular: true },
  { name: 'Стрижка + Борода', description: 'Полный апгрейд за один визит. Стрижка, борода, укладка — выходишь готовый на деловую встречу или свидание.', price: 4000, duration: 75, popular: true },
  { name: 'Оформление бороды', description: 'Чёткий контур, идеальная форма. Борода, которая выглядит ухоженно даже через неделю.', price: 1800, duration: 30, popular: false },
  { name: 'Королевское бритьё', description: 'Горячие полотенца, опасная бритва, масла. 40 минут релакса — как в спа, только для лица.', price: 2200, duration: 40, popular: false },
  { name: 'Детская стрижка', description: 'Для юных джентльменов до 12 лет. Терпеливые мастера + мультики = ребёнок сидит спокойно.', price: 1500, duration: 30, popular: false },
  { name: 'Камуфляж седины', description: 'Натуральное тонирование без эффекта «крашеных волос». Минус 10 лет за 25 минут.', price: 1500, duration: 25, popular: false },
]

const masters = [
  { name: 'Александр Волков', role: 'Основатель, Top Barber', experience: '12 лет', specialty: 'Классические стрижки, Опасная бритва', initials: 'АВ' },
  { name: 'Дмитрий Орлов', role: 'Senior Barber', experience: '8 лет', specialty: 'Fade, Современные текстуры', initials: 'ДО' },
  { name: 'Максим Соколов', role: 'Senior Barber', experience: '7 лет', specialty: 'Бороды, Камуфляж седины', initials: 'МС' },
  { name: 'Игорь Лебедев', role: 'Barber', experience: '5 лет', specialty: 'Креативные стрижки, Hair Tattoo', initials: 'ИЛ' },
]

const reviews = [
  { name: 'Михаил К.', text: 'Три года хожу только сюда. Жена говорит, что после Black Blade я выгляжу как из кино. Александр — лучший мастер, у которого я был.', rating: 5, service: 'Стрижка + Борода' },
  { name: 'Андрей С.', text: 'Пришёл скептиком — ушёл фанатом. Королевское бритьё реально расслабляет лучше массажа. Плюс виски в подарок — приятный бонус.', rating: 5, service: 'Королевское бритьё' },
  { name: 'Денис В.', text: 'Дмитрий сделал мне fade, который коллеги обсуждали неделю. Да, дороже чем в эконом-парикмахерской. Но я выгляжу дорого — оно того стоит.', rating: 5, service: 'Мужская стрижка' },
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
