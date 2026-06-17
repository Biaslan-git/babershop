import { NextRequest, NextResponse } from 'next/server'
import { refreshAccessToken } from '@/lib/cms/auth'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('cms_refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token отсутствует' }, { status: 401 })
    }

    const newAccessToken = await refreshAccessToken(refreshToken)

    if (!newAccessToken) {
      const response = NextResponse.json({ error: 'Сессия истекла' }, { status: 401 })
      response.cookies.delete('cms_access_token')
      response.cookies.delete('cms_refresh_token')
      return response
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set('cms_access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
