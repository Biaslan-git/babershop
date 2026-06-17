'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Reorder } from 'framer-motion'
import { Plus, Trash2, GripVertical, Pencil, Loader2, AlertTriangle, Copy, Search } from 'lucide-react'
import { toast } from 'sonner'
import { getCollectionSchema } from '@/lib/cms/schema'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ResponsiveEditor } from '@/components/admin/ResponsiveEditor'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import type { CollectionItem, FieldDefinition } from '@/lib/cms/types'

const collectionMeta: Record<string, { title: string; description: string }> = {
  services: { title: 'Услуги', description: 'Список услуг и цены' },
  masters: { title: 'Мастера', description: 'Команда барбершопа' },
  reviews: { title: 'Отзывы', description: 'Отзывы клиентов' },
  gallery: { title: 'Галерея', description: 'Фотографии работ' },
  socials: { title: 'Соцсети', description: 'Ссылки на социальные сети' },
  navigation: { title: 'Навигация', description: 'Пункты меню' },
}

export default function CollectionEditorPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = use(params)
  const router = useRouter()
  const [items, setItems] = useState<CollectionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null)
  const [editingData, setEditingData] = useState<Record<string, unknown>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const collectionSchema = getCollectionSchema(name)
  const meta = collectionMeta[name] || { title: name, description: '' }

  useEffect(() => {
    if (!collectionSchema) {
      router.push('/admin')
      return
    }

    async function fetchItems() {
      try {
        const res = await fetch(`/api/cms/collections?collection=${name}`)
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch {
        toast.error('Ошибка загрузки')
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [name, collectionSchema, router])

  const handleReorder = async (newOrder: CollectionItem[]) => {
    setItems(newOrder)
    try {
      await fetch('/api/cms/collections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: name,
          orderedIds: newOrder.map(item => item.id),
        }),
      })
    } catch {
      toast.error('Ошибка сортировки')
    }
  }

  const handleAdd = async () => {
    setIsCreating(true)
    try {
      const defaultData: Record<string, unknown> = {}
      Object.entries(collectionSchema!).forEach(([key, config]) => {
        if (config.type === 'boolean') defaultData[key] = false
        else if (config.type === 'number') defaultData[key] = 0
        else defaultData[key] = ''
      })

      const res = await fetch('/api/cms/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: name, data: defaultData }),
      })

      if (res.ok) {
        const newItem = await res.json()
        setItems(prev => [...prev, newItem])
        setEditingItem(newItem)
        setEditingData(newItem.data)
      }
    } catch {
      toast.error('Ошибка добавления')
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = (item: CollectionItem) => {
    setEditingItem(item)
    setEditingData({ ...item.data })
  }

  const handleDuplicate = async (item: CollectionItem) => {
    try {
      const res = await fetch('/api/cms/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: name, data: { ...item.data } }),
      })

      if (res.ok) {
        const newItem = await res.json()
        setItems(prev => [...prev, newItem])
        toast.success('Скопировано')
      }
    } catch {
      toast.error('Ошибка копирования')
    }
  }

  const handleCloseEditor = () => {
    setEditingItem(null)
    setEditingData({})
    setTouched({})
  }

  const validateData = () => {
    if (!collectionSchema) return []

    const errors: string[] = []
    Object.entries(collectionSchema).forEach(([field, config]) => {
      if (config.required) {
        const value = editingData[field]
        if (value === undefined || value === null || value === '') {
          errors.push(config.label)
        }
      }
    })
    return errors
  }

  const handleSave = async () => {
    if (!editingItem) return

    const errors = validateData()
    if (errors.length > 0) {
      const allTouched: Record<string, boolean> = {}
      Object.keys(collectionSchema!).forEach(key => { allTouched[key] = true })
      setTouched(allTouched)
      toast.error('Заполните обязательные поля')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingItem.id, data: editingData }),
      })

      if (res.ok) {
        const updated = await res.json()
        setItems(prev =>
          prev.map(item => (item.id === editingItem.id ? updated : item))
        )
        handleCloseEditor()
        toast.success('Сохранено')
      }
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const res = await fetch('/api/cms/collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      })

      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== deleteId))
        if (editingItem?.id === deleteId) {
          handleCloseEditor()
        }
        toast.success('Удалено')
        setDeleteId(null)
      }
    } catch {
      toast.error('Ошибка удаления')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFieldChange = (field: string, value: unknown) => {
    setEditingData(prev => ({ ...prev, [field]: value }))
  }

  if (!collectionSchema) return null

  const getItemTitle = (item: CollectionItem) => {
    const data = item.data as Record<string, unknown>
    return (data.name as string) || (data.title as string) || (data.label as string) || `#${item.id.slice(-4)}`
  }

  const getItemSubtitle = (item: CollectionItem) => {
    const data = item.data as Record<string, unknown>
    if (data.price) return `${data.price} ₽`
    if (data.role) return data.role as string
    if (data.service) return data.service as string
    return null
  }

  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true
    const data = item.data as Record<string, unknown>
    const searchLower = searchQuery.toLowerCase()
    return Object.values(data).some(val =>
      String(val).toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{items.length} элементов</p>
        </div>
        <Button size="sm" onClick={handleAdd} disabled={isCreating}>
          {isCreating ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
          Добавить
        </Button>
      </div>

      {items.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <Separator />

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
              <Skeleton className="size-4" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Ничего не найдено' : 'Пока ничего нет'}
          </p>
          {!searchQuery && (
            <Button variant="outline" size="sm" onClick={handleAdd} disabled={isCreating}>
              <Plus className="size-4 mr-2" />
              Добавить первый элемент
            </Button>
          )}
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={filteredItems}
          onReorder={handleReorder}
          className="space-y-1"
        >
          {filteredItems.map(item => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="list-none"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing group">
                <GripVertical className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{getItemTitle(item)}</p>
                  {getItemSubtitle(item) && (
                    <p className="text-xs text-muted-foreground truncate">{getItemSubtitle(item)}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(item)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDuplicate(item)}>
                    <Copy className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <ResponsiveEditor
        open={!!editingItem}
        onOpenChange={open => !open && handleCloseEditor()}
        title="Редактирование"
        description="Измените данные и сохраните"
        onSave={handleSave}
        isSaving={isSaving}
      >
        {collectionSchema && Object.entries(collectionSchema).map(([field, config]) => {
          const hasError = touched[field] && config.required && !editingData[field]
          return (
            <FieldInput
              key={field}
              field={field}
              config={config}
              value={editingData[field]}
              onChange={value => handleFieldChange(field, value)}
              onBlur={() => setTouched(prev => ({ ...prev, [field]: true }))}
              hasError={hasError}
            />
          )
        })}
      </ResponsiveEditor>

      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Удалить элемент?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="size-4 animate-spin mr-2" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FieldInput({
  field,
  config,
  value,
  onChange,
  onBlur,
  hasError,
}: {
  field: string
  config: FieldDefinition
  value: unknown
  onChange: (value: unknown) => void
  onBlur?: () => void
  hasError?: boolean
}) {
  const errorClass = hasError ? 'border-destructive focus-visible:ring-destructive/50' : ''

  switch (config.type) {
    case 'text':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field} className={hasError ? 'text-destructive' : ''}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={field}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            className={errorClass}
          />
        </div>
      )

    case 'textarea':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field} className={hasError ? 'text-destructive' : ''}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            id={field}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            rows={config.rows || 3}
            className={errorClass}
          />
        </div>
      )

    case 'richtext':
      return (
        <div className="grid gap-2">
          <Label className={hasError ? 'text-destructive' : ''}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <RichTextEditor
            value={(value as string) || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={config.placeholder}
            hasError={hasError}
          />
        </div>
      )

    case 'number':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field} className={hasError ? 'text-destructive' : ''}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={field}
            type="number"
            value={(value as number) ?? ''}
            onChange={e => onChange(e.target.valueAsNumber || 0)}
            onBlur={onBlur}
            min={config.min}
            max={config.max}
            className={errorClass}
          />
        </div>
      )

    case 'boolean':
      return (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor={field} className="font-normal">{config.label}</Label>
          <Switch
            id={field}
            checked={!!value}
            onCheckedChange={checked => onChange(checked)}
          />
        </div>
      )

    case 'image':
      return (
        <div className="grid gap-2">
          <Label>{config.label}</Label>
          <ImageUploader
            value={(value as string) || ''}
            onChange={url => onChange(url)}
          />
        </div>
      )

    default:
      return (
        <div className="grid gap-2">
          <Label htmlFor={field}>{config.label}</Label>
          <Input
            id={field}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
          />
        </div>
      )
  }
}
