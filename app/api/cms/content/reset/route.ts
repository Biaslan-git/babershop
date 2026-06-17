import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/cms/auth'
import { upsertSection } from '@/lib/cms/db'
import { getDefaultSection } from '@/lib/cms/defaults'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cms_access_token')?.value
  if (!token) return false
  const payload = await verifyAccessToken(token)
  return !!payload
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Не указан id секции' }, { status: 400 })
  }

  const defaultData = getDefaultSection(id)
  if (!defaultData) {
    return NextResponse.json({ error: 'Секция не найдена' }, { status: 404 })
  }

  const section = upsertSection(id, defaultData)
  return NextResponse.json(section)
}
