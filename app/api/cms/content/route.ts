import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/cms/auth'
import { getSection, upsertSection, getAllSections } from '@/lib/cms/db'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cms_access_token')?.value
  if (!token) return false
  const payload = await verifyAccessToken(token)
  return !!payload
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const section = getSection(id)
    if (!section) {
      return NextResponse.json({ error: 'Секция не найдена' }, { status: 404 })
    }
    return NextResponse.json(section)
  }

  const sections = getAllSections()
  return NextResponse.json(sections)
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const { id, data } = await request.json()

    if (!id || !data) {
      return NextResponse.json({ error: 'Не указан id или data' }, { status: 400 })
    }

    const section = upsertSection(id, data)
    return NextResponse.json(section)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
