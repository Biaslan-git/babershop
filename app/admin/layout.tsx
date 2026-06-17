'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AuthProvider, useAuth } from '@/components/admin/AuthProvider'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bell } from 'lucide-react'
import './globals.css'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/admin': { title: 'Дашборд', description: 'Обзор контента' },
  '/admin/media': { title: 'Медиа', description: 'Изображения и файлы' },
  '/admin/settings': { title: 'Настройки', description: 'Конфигурация CMS' },
}

const sectionTitles: Record<string, string> = {
  hero: 'Hero секция',
  about: 'О нас',
  contact: 'Контакты',
  footer: 'Футер',
  seo: 'SEO настройки',
}

const collectionTitles: Record<string, string> = {
  services: 'Услуги',
  masters: 'Мастера',
  reviews: 'Отзывы',
  gallery: 'Галерея',
}

function getPageInfo(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname]

  const sectionMatch = pathname.match(/\/admin\/sections\/(.+)/)
  if (sectionMatch) {
    const id = sectionMatch[1]
    return { title: sectionTitles[id] || id, description: 'Редактирование секции' }
  }

  const collectionMatch = pathname.match(/\/admin\/collections\/(.+)/)
  if (collectionMatch) {
    const name = collectionMatch[1]
    return { title: collectionTitles[name] || name, description: 'Управление коллекцией' }
  }

  return { title: 'Админ', description: '' }
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  const isLoginPage = pathname === '/admin/login'
  const pageInfo = getPageInfo(pathname)

  if (isLoading) {
    return (
      <div className="admin-wrapper flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 animate-pulse" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !isLoginPage) {
    return null
  }

  if (isLoginPage) {
    return <div className="admin-wrapper">{children}</div>
  }

  return (
    <div className="admin-wrapper">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:block">
                <h1 className="text-sm font-medium leading-none">{pageInfo.title}</h1>
                {pageInfo.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{pageInfo.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-4" />
                </Button>
              </Link>
              <a href="/" target="_blank">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  Открыть сайт
                  <ExternalLink className="size-3" />
                </Button>
              </a>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </TooltipProvider>
  )
}
