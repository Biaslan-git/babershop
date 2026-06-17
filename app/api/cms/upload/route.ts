import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/cms/auth'
import { createMedia, getAllMedia, deleteMedia, getMedia } from '@/lib/cms/db'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cms_access_token')?.value
  if (!token) return false
  const payload = await verifyAccessToken(token)
  return !!payload
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function GET() {
  const media = getAllMedia()
  return NextResponse.json(media)
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    await ensureUploadDir()

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Недопустимый тип файла' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 10MB)' }, { status: 400 })
    }

    const id = generateId()
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${id}.${ext}`
    const filePath = join(UPLOAD_DIR, filename)
    const publicPath = `/uploads/${filename}`

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const media = createMedia(id, file.name, publicPath)
    return NextResponse.json(media, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Не указан id' }, { status: 400 })
    }

    const media = getMedia(id)
    if (!media) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
    }

    const filePath = join(process.cwd(), 'public', media.path)
    try {
      await unlink(filePath)
    } catch {
      // File might not exist, continue with db deletion
    }

    deleteMedia(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
