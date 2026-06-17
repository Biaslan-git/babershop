import { NextRequest, NextResponse } from 'next/server'
import { upsertSection, getDb } from '@/lib/cms/db'

interface ImportData {
  version: number
  sections: Array<{ id: string; data: Record<string, unknown> }>
  collections: Record<string, Array<{
    id: string
    order: number
    data: Record<string, unknown>
    createdAt: string
    updatedAt: string
  }>>
  preferences?: { accentHue: number; theme: string }
}

export async function POST(request: NextRequest) {
  try {
    const data: ImportData = await request.json()

    if (!data.version || !data.sections) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const db = getDb()

    // Import sections
    for (const section of data.sections) {
      upsertSection(section.id, section.data)
    }

    // Import collections
    if (data.collections) {
      for (const [collection, items] of Object.entries(data.collections)) {
        // Clear existing items
        db.prepare('DELETE FROM collection_items WHERE collection = ?').run(collection)

        // Insert imported items
        const stmt = db.prepare(`
          INSERT INTO collection_items (id, collection, item_order, data, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `)

        for (const item of items) {
          stmt.run(
            item.id,
            collection,
            item.order,
            JSON.stringify(item.data),
            item.createdAt,
            item.updatedAt
          )
        }
      }
    }

    // Import preferences
    if (data.preferences) {
      db.prepare(`
        UPDATE preferences SET accent_hue = ?, theme = ? WHERE id = ?
      `).run(data.preferences.accentHue, data.preferences.theme, 'default')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
