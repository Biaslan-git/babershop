'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Scissors,
  Users,
  Star,
  Image,
  Sparkles,
  FileText,
  Mail,
  LayoutTemplate,
  Search,
  ArrowUpRight,
} from 'lucide-react'

interface CollectionStats {
  services: number
  masters: number
  reviews: number
  gallery: number
}

const collections = [
  { key: 'services', label: 'Услуги', icon: Scissors },
  { key: 'masters', label: 'Мастера', icon: Users },
  { key: 'reviews', label: 'Отзывы', icon: Star },
  { key: 'gallery', label: 'Галерея', icon: Image },
] as const

const sections = [
  { id: 'hero', label: 'Hero', description: 'Главный экран', icon: Sparkles },
  { id: 'about', label: 'О нас', description: 'О компании', icon: FileText },
  { id: 'contact', label: 'Контакты', description: 'Связь', icon: Mail },
  { id: 'footer', label: 'Футер', description: 'Подвал', icon: LayoutTemplate },
  { id: 'seo', label: 'SEO', description: 'Мета-теги', icon: Search },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<CollectionStats>({
    services: 0,
    masters: 0,
    reviews: 0,
    gallery: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const names = ['services', 'masters', 'reviews', 'gallery']
        const results = await Promise.all(
          names.map(c =>
            fetch(`/api/cms/collections?collection=${c}`).then(r => r.json())
          )
        )
        setStats({
          services: results[0]?.length || 0,
          masters: results[1]?.length || 0,
          reviews: results[2]?.length || 0,
          gallery: results[3]?.length || 0,
        })
      } catch {
        // Keep defaults
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-10">
      {/* Collections */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Коллекции
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {collections.map(item => (
            <Link
              key={item.key}
              href={`/admin/collections/${item.key}`}
              className="group relative bg-card rounded-xl border p-5 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-200"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <item.icon className="size-5 text-muted-foreground mb-4 group-hover:text-emerald-600 transition-colors duration-200" />
              <p className="text-3xl font-light tabular-nums tracking-tight">
                {isLoading ? '–' : stats[item.key]}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Секции
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(section => (
            <Link
              key={section.id}
              href={`/admin/sections/${section.id}`}
              className="group flex items-center gap-4 bg-card rounded-xl border p-4 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-200"
            >
              <div className="size-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors duration-200">
                <section.icon className="size-5 text-muted-foreground group-hover:text-emerald-600 transition-colors duration-200" />
              </div>
              <div>
                <p className="text-sm font-medium">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
