'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  FileText,
  Users,
  Scissors,
  Star,
  Image,
  Settings,
  LogOut,
  Sparkles,
  Mail,
  LayoutTemplate,
  FolderOpen,
  Search,
} from 'lucide-react'
import { useAuth } from './AuthProvider'

const sections = [
  { id: 'hero', label: 'Hero', icon: Sparkles },
  { id: 'about', label: 'О нас', icon: FileText },
  { id: 'contact', label: 'Контакты', icon: Mail },
  { id: 'footer', label: 'Футер', icon: LayoutTemplate },
  { id: 'seo', label: 'SEO', icon: Search },
]

const collections = [
  { name: 'services', label: 'Услуги', icon: Scissors },
  { name: 'masters', label: 'Мастера', icon: Users },
  { name: 'reviews', label: 'Отзывы', icon: Star },
  { name: 'gallery', label: 'Галерея', icon: Image },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin" />}
              tooltip="Админ"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/20">
                <svg className="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm font-medium">Админ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin" />}
                  isActive={pathname === '/admin'}
                  tooltip="Дашборд"
                >
                  <LayoutDashboard className="size-4" />
                  <span>Дашборд</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Секции</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map(section => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    render={<Link href={`/admin/sections/${section.id}`} />}
                    isActive={pathname === `/admin/sections/${section.id}`}
                    tooltip={section.label}
                  >
                    <section.icon className="size-4" />
                    <span>{section.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Коллекции</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map(collection => (
                <SidebarMenuItem key={collection.name}>
                  <SidebarMenuButton
                    render={<Link href={`/admin/collections/${collection.name}`} />}
                    isActive={pathname === `/admin/collections/${collection.name}`}
                    tooltip={collection.label}
                  >
                    <collection.icon className="size-4" />
                    <span>{collection.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/admin/media" />}
              isActive={pathname === '/admin/media'}
              tooltip="Медиа"
            >
              <FolderOpen className="size-4" />
              <span>Медиа</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/admin/settings" />}
              isActive={pathname === '/admin/settings'}
              tooltip="Настройки"
            >
              <Settings className="size-4" />
              <span>Настройки</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-destructive hover:text-destructive"
              tooltip="Выйти"
            >
              <LogOut className="size-4" />
              <span>Выйти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
