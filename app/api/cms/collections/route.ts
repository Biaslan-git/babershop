import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/cms/auth'
import {
  getCollectionItems,
  createCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  reorderCollectionItems,
} from '@/lib/cms/db'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cms_access_token')?.value
  if (!token) return false
  const payload = await verifyAccessToken(token)
  return !!payload
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const collection = searchParams.get('collection')

  if (!collection) {
    return NextResponse.json({ error: 'Не указана коллекция' }, { status: 400 })
  }

  const items = getCollectionItems(collection)
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const { collection, data } = await request.json()

    if (!collection || !data) {
      return NextResponse.json({ error: 'Не указана коллекция или данные' }, { status: 400 })
    }

    const id = generateId()
    const item = createCollectionItem(collection, id, data)
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const { id, data } = await request.json()

    if (!id || !data) {
      return NextResponse.json({ error: 'Не указан id или данные' }, { status: 400 })
    }

    const item = updateCollectionItem(id, data)
    if (!item) {
      return NextResponse.json({ error: 'Элемент не найден' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
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

    const deleted = deleteCollectionItem(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Элемент не найден' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const { collection, orderedIds } = await request.json()

    if (!collection || !orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'Не указана коллекция или порядок' }, { status: 400 })
    }

    reorderCollectionItems(collection, orderedIds)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
