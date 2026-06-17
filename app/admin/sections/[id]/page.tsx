'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { getSectionSchema } from '@/lib/cms/schema'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ScheduleEditor } from '@/components/admin/ScheduleEditor'
import type { SectionContent, FieldDefinition } from '@/lib/cms/types'

const sectionLabels: Record<string, { title: string; description: string }> = {
  hero: { title: 'Hero', description: 'Главный экран сайта' },
  about: { title: 'О нас', description: 'Информация о компании' },
  contact: { title: 'Контакты', description: 'Адрес, телефон, email' },
  footer: { title: 'Футер', description: 'Подвал сайта' },
  booking: { title: 'Бронирование', description: 'Форма записи' },
  seo: { title: 'SEO', description: 'Мета-теги и OG-изображения' },
}

export default function SectionEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [data, setData] = useState<Record<string, unknown>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const sectionSchema = getSectionSchema(id)
  const meta = sectionLabels[id] || { title: id, description: '' }

  useEffect(() => {
    if (!sectionSchema) {
      router.push('/admin')
      return
    }

    async function fetchSection() {
      try {
        const res = await fetch(`/api/cms/content?id=${id}`)
        if (res.ok) {
          const section: SectionContent = await res.json()
          setData(section.data)
        }
      } catch {
        toast.error('Ошибка загрузки')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSection()
  }, [id, sectionSchema, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data }),
      })

      if (res.ok) {
        toast.success('Сохранено')
      } else {
        toast.error('Ошибка сохранения')
      }
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3000)
      return
    }
    handleReset()
  }

  const handleReset = async () => {
    setIsResetting(true)
    setConfirmReset(false)
    try {
      const res = await fetch(`/api/cms/content/reset?id=${id}`, {
        method: 'PUT',
      })

      if (res.ok) {
        const section = await res.json()
        setData(section.data)
        toast.success('Сброшено')
      } else {
        toast.error('Ошибка сброса')
      }
    } catch {
      toast.error('Ошибка сброса')
    } finally {
      setIsResetting(false)
    }
  }

  if (!sectionSchema) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetClick}
            disabled={isResetting}
            className={confirmReset ? 'text-destructive hover:text-destructive' : ''}
          >
            {isResetting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            <span className="ml-2 hidden sm:inline">{confirmReset ? 'Уверены?' : 'Сбросить'}</span>
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 animate-spin mr-2" />}
            Сохранить
          </Button>
        </div>
      </div>

      <Separator />

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(sectionSchema).map(([field, config]) => (
            <FieldInput
              key={field}
              field={field}
              config={config}
              value={data[field]}
              onChange={value => handleFieldChange(field, value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FieldInput({
  field,
  config,
  value,
  onChange,
}: {
  field: string
  config: FieldDefinition
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (config.type) {
    case 'text':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={field}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={config.placeholder}
          />
        </div>
      )

    case 'textarea':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            id={field}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={config.placeholder}
            rows={config.rows || 4}
          />
        </div>
      )

    case 'richtext':
      return (
        <div className="grid gap-2">
          <Label>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <RichTextEditor
            value={(value as string) || ''}
            onChange={onChange}
            placeholder={config.placeholder}
          />
        </div>
      )

    case 'number':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field}>
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={field}
            type="number"
            value={(value as number) ?? ''}
            onChange={e => onChange(e.target.valueAsNumber || 0)}
            min={config.min}
            max={config.max}
            className="max-w-[200px]"
          />
        </div>
      )

    case 'boolean':
      return (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor={field}>{config.label}</Label>
          </div>
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

    case 'json':
      return (
        <div className="grid gap-2">
          <Label htmlFor={field}>{config.label}</Label>
          <Textarea
            id={field}
            value={typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)}
            onChange={e => {
              try {
                onChange(JSON.parse(e.target.value))
              } catch {
                onChange(e.target.value)
              }
            }}
            rows={config.rows || 6}
            className="font-mono text-xs"
          />
        </div>
      )

    case 'schedule':
      return (
        <div className="grid gap-2">
          <Label>{config.label}</Label>
          <ScheduleEditor
            value={value as { day: string; time: string }[]}
            onChange={onChange}
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
