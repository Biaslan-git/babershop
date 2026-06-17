import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('cms_access_token')
  response.cookies.delete('cms_refresh_token')
  return response
}
