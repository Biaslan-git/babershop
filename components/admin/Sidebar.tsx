'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Users,
  Scissors,
  Star,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Mail,
  LayoutTemplate,
} from 'lucide-react'
import { useAuth } from './AuthProvider'

const sections = [
  { id: 'hero', label: 'Hero', icon: Sparkles },
  { id: 'about', label: 'О нас', icon: FileText },
  { id: 'contact', label: 'Контакты', icon: Mail },
  { id: 'footer', label: 'Футер', icon: LayoutTemplate },
]

const collections = [
  { name: 'services', label: 'Услуги', icon: Scissors },
  { name: 'masters', label: 'Мастера', icon: Users },
  { name: 'reviews', label: 'Отзывы', icon: Star },
  { name: 'gallery', label: 'Галерея', icon: Image },
]

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 admin-btn admin-btn-secondary"
        aria-label="Открыть меню"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isMobileOpen ? 0 : undefined }}
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[var(--surface)] border-r border-[var(--border)]
          flex flex-col z-50
          max-lg:translate-x-[-100%] ${isMobileOpen ? 'max-lg:translate-x-0' : ''}
          transition-transform duration-300 ease-out
        `}
      >
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">CMS Admin</h1>
              <p className="text-xs text-[var(--text-muted)]">void-tech.ru</p>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden admin-btn-ghost p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <NavItem
              href="/admin"
              icon={LayoutDashboard}
              label="Дашборд"
              active={isActive('/admin')}
              onClick={() => setIsMobileOpen(false)}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3">
              Секции
            </p>
            <div className="space-y-1">
              {sections.map(section => (
                <NavItem
                  key={section.id}
                  href={`/admin/sections/${section.id}`}
                  icon={section.icon}
                  label={section.label}
                  active={isActive(`/admin/sections/${section.id}`)}
                  onClick={() => setIsMobileOpen(false)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3">
              Коллекции
            </p>
            <div className="space-y-1">
              {collections.map(collection => (
                <NavItem
                  key={collection.name}
                  href={`/admin/collections/${collection.name}`}
                  icon={collection.icon}
                  label={collection.label}
                  active={isActive(`/admin/collections/${collection.name}`)}
                  onClick={() => setIsMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--border)] space-y-1">
          <NavItem
            href="/admin/settings"
            icon={Settings}
            label="Настройки"
            active={isActive('/admin/settings')}
            onClick={() => setIsMobileOpen(false)}
          />
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--error)] transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick?: () => void
}

function NavItem({ href, icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
        ${
          active
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1">{label}</span>
      {active && (
        <motion.div layoutId="nav-active-indicator">
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      )}
    </Link>
  )
}
