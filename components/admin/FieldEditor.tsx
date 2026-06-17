'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import type { FieldDefinition } from '@/lib/cms/types'

interface FieldEditorProps {
  field: string
  config: FieldDefinition
  value: unknown
  onChange: (value: unknown) => void
}

export function FieldEditor({ field, config, value, onChange }: FieldEditorProps) {
  const renderField = () => {
    switch (config.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={config.placeholder}
            className="admin-input"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={config.placeholder}
            rows={config.rows || 4}
            className="admin-input resize-none"
          />
        )

      case 'richtext':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={config.placeholder}
            rows={config.rows || 6}
            className="admin-input resize-none font-mono text-sm"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) ?? ''}
            onChange={e => onChange(e.target.valueAsNumber || 0)}
            min={config.min}
            max={config.max}
            className="admin-input"
          />
        )

      case 'boolean':
        return (
          <Toggle
            checked={!!value}
            onChange={checked => onChange(checked)}
          />
        )

      case 'image':
        return (
          <ImageUploader
            value={(value as string) || ''}
            onChange={url => onChange(url)}
          />
        )

      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value || {}, null, 2)}
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value)
                onChange(parsed)
              } catch {
                onChange(e.target.value)
              }
            }}
            rows={config.rows || 6}
            className="admin-input resize-none font-mono text-sm"
          />
        )

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={(value as string) || '#000000'}
              onChange={e => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
            />
            <input
              type="text"
              value={(value as string) || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="#000000"
              className="admin-input flex-1"
            />
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className="admin-input"
          />
        )

      case 'time':
        return (
          <input
            type="time"
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className="admin-input"
          />
        )

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className="admin-input"
          >
            <option value="">Выберите...</option>
            {config.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      default:
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className="admin-input"
          />
        )
    }
  }

  return (
    <div>
      <label className="admin-label">
        {config.label}
        {config.required && <span className="text-[var(--error)] ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full transition-colors
        ${checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}
      `}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  )
}

function ImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/cms/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          onChange(data.path)
        }
      } catch {
        // Handle error
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg'],
    },
    maxFiles: 1,
  })

  if (value) {
    return (
      <div className="relative group">
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[var(--border)]">
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => onChange('')}
          className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-[var(--error)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--border-light)]'}
      `}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Загрузка...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {isDragActive ? (
            <Upload className="w-8 h-8 text-[var(--accent)]" />
          ) : (
            <ImageIcon className="w-8 h-8 text-[var(--text-muted)]" />
          )}
          <p className="text-sm text-[var(--text-secondary)]">
            {isDragActive
              ? 'Отпустите файл'
              : 'Перетащите изображение или нажмите для выбора'}
          </p>
        </div>
      )}
    </div>
  )
}
