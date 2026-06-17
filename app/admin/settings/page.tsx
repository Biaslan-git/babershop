'use client'

import { useRef, useState } from 'react'
import { Download, Upload, Loader2, Database, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/cms/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cms-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Экспорт завершён')
    } catch {
      toast.error('Ошибка экспорта')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (file: File) => {
    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const res = await fetch('/api/cms/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Импорт завершён')
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Ошибка импорта')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Настройки</h1>
        <p className="text-sm text-muted-foreground">Управление данными CMS</p>
      </div>

      <Separator />

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="size-4" />
              Резервное копирование
            </CardTitle>
            <CardDescription>
              Экспортируйте данные для бэкапа или переноса на другой сайт
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Download className="size-4 mr-2" />
              )}
              Экспорт
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImport(file)
              }}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
              {isImporting ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Upload className="size-4 mr-2" />
              )}
              Импорт
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">О системе</CardTitle>
            <CardDescription>
              void-tech CMS — универсальная система управления контентом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="https://void-tech.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              void-tech.ru
              <ExternalLink className="size-3" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
