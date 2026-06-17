'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, Trash2, Copy, Check, ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

interface MediaFile {
  id: string
  filename: string
  path: string
  uploadedAt: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/cms/media')
      if (res.ok) {
        setMedia(await res.json())
      }
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/cms/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error()
      }
      toast.success(`Загружено ${files.length} файл(ов)`)
      fetchMedia()
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCopy = (path: string, id: string) => {
    navigator.clipboard.writeText(path)
    setCopiedId(id)
    toast.success('Скопировано')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteClick = (id: string) => {
    if (deleteId === id) {
      handleDelete(id)
    } else {
      setDeleteId(id)
      setTimeout(() => setDeleteId(null), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/cms/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id))
        toast.success('Удалено')
        setDeleteId(null)
      }
    } catch {
      toast.error('Ошибка удаления')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Медиа</h1>
          <p className="text-sm text-muted-foreground">{media.length} файлов</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
          <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Upload className="size-4 mr-2" />
            )}
            Загрузить
          </Button>
        </div>
      </div>

      <Separator />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-12 rounded-lg bg-muted flex items-center justify-center mb-4">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">Нет загруженных файлов</p>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4 mr-2" />
            Загрузить
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {media.map(file => (
            <div key={file.id} className="group relative aspect-square rounded-lg border bg-muted overflow-hidden">
              <img
                src={file.path}
                alt={file.filename}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  size="icon"
                  variant="secondary"
                  className="size-8"
                  onClick={() => handleCopy(file.path, file.id)}
                >
                  {copiedId === file.id ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant={deleteId === file.id ? 'destructive' : 'secondary'}
                  className="size-8"
                  onClick={() => handleDeleteClick(file.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[10px] text-white/80 truncate">{file.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
