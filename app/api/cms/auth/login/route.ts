import { NextResponse } from 'next/server'
import { validatePassword, generateTokens } from '@/lib/cms/auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }

    const tokens = await generateTokens()

    const response = NextResponse.json({ success: true })

    response.cookies.set('cms_access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    })

    response.cookies.set('cms_refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
