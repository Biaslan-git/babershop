'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ScheduleItem {
  day: string
  time: string
}

interface ScheduleEditorProps {
  value: ScheduleItem[]
  onChange: (value: ScheduleItem[]) => void
}

export function ScheduleEditor({ value = [], onChange }: ScheduleEditorProps) {
  const items = Array.isArray(value) ? value : []

  const handleAdd = () => {
    onChange([...items, { day: '', time: '' }])
  }

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'day' | 'time', val: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    )
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="Пн-Пт"
            value={item.day}
            onChange={e => handleChange(index, 'day', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="10:00 — 20:00"
            value={item.time}
            onChange={e => handleChange(index, 'time', e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => handleRemove(index)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="size-4 mr-2" />
        Добавить
      </Button>
    </div>
  )
}
