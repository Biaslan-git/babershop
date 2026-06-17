'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
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
      <div className="relative group rounded-lg overflow-hidden border">
        <img
          src={value}
          alt=""
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4 mr-2" />
            Удалить
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      )}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {isDragActive ? (
            <Upload className="w-8 h-8 text-primary" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? 'Отпустите файл'
              : 'Перетащите изображение или нажмите для выбора'}
          </p>
        </div>
      )}
    </div>
  )
}
