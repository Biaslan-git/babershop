import { NextResponse } from 'next/server'
import { getAllSections, getCollectionItems, getAllMedia, getPreferences } from '@/lib/cms/db'
import { getCollectionNames } from '@/lib/cms/schema'

export async function GET() {
  const sections = getAllSections()
  const collectionNames = getCollectionNames()

  const collections: Record<string, unknown[]> = {}
  for (const name of collectionNames) {
    collections[name] = getCollectionItems(name)
  }

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sections,
    collections,
    media: getAllMedia(),
    preferences: getPreferences(),
  }

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="cms-backup-${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}
