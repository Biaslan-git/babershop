import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/cms/auth'
import { getPreferences, updatePreferences } from '@/lib/cms/db'

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('cms_access_token')?.value
  if (!token) return false
  const payload = await verifyAccessToken(token)
  return !!payload
}

export async function GET() {
  const prefs = getPreferences()
  return NextResponse.json(prefs)
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const updated = updatePreferences(data)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
