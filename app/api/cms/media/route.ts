import { NextRequest, NextResponse } from 'next/server'
import { getAllMedia, deleteMedia, getMedia } from '@/lib/cms/db'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  const media = getAllMedia()
  return NextResponse.json(media)
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()

  const file = getMedia(id)
  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    await unlink(join(process.cwd(), 'public', file.path))
  } catch {
    // File might not exist, continue anyway
  }

  deleteMedia(id)
  return NextResponse.json({ success: true })
}
