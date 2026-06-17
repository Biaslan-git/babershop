import Database from 'better-sqlite3'
import { join } from 'path'
import type { SectionContent, CollectionItem, MediaFile, UserPreferences } from './types'

const DB_PATH = join(process.cwd(), 'data', 'cms.db')

let db: Database.Database | null = null

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initSchema()
  }
  return db
}

function initSchema() {
  const database = db!

  database.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS collection_items (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      item_order INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_collection_items_collection
      ON collection_items(collection);

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS preferences (
      id TEXT PRIMARY KEY DEFAULT 'default',
      accent_hue INTEGER NOT NULL DEFAULT 210,
      theme TEXT NOT NULL DEFAULT 'dark'
    );

    INSERT OR IGNORE INTO preferences (id) VALUES ('default');
  `)
}

export function getSection(id: string): SectionContent | null {
  const row = getDb().prepare('SELECT * FROM sections WHERE id = ?').get(id) as {
    id: string
    data: string
    updated_at: string
  } | undefined

  if (!row) return null

  return {
    id: row.id,
    data: JSON.parse(row.data),
    updatedAt: row.updated_at,
  }
}

export function upsertSection(id: string, data: Record<string, unknown>): SectionContent {
  const now = new Date().toISOString()
  const jsonData = JSON.stringify(data)

  getDb().prepare(`
    INSERT INTO sections (id, data, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET data = ?, updated_at = ?
  `).run(id, jsonData, now, jsonData, now)

  return { id, data, updatedAt: now }
}

export function getAllSections(): SectionContent[] {
  const rows = getDb().prepare('SELECT * FROM sections').all() as {
    id: string
    data: string
    updated_at: string
  }[]

  return rows.map(row => ({
    id: row.id,
    data: JSON.parse(row.data),
    updatedAt: row.updated_at,
  }))
}

export function getCollectionItems(collection: string): CollectionItem[] {
  const rows = getDb().prepare(`
    SELECT * FROM collection_items
    WHERE collection = ?
    ORDER BY item_order ASC
  `).all(collection) as {
    id: string
    collection: string
    item_order: number
    data: string
    created_at: string
    updated_at: string
  }[]

  return rows.map(row => ({
    id: row.id,
    order: row.item_order,
    data: JSON.parse(row.data),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export function createCollectionItem(
  collection: string,
  id: string,
  data: Record<string, unknown>
): CollectionItem {
  const now = new Date().toISOString()
  const jsonData = JSON.stringify(data)

  const maxOrder = getDb().prepare(`
    SELECT MAX(item_order) as max_order FROM collection_items WHERE collection = ?
  `).get(collection) as { max_order: number | null }

  const order = (maxOrder?.max_order ?? -1) + 1

  getDb().prepare(`
    INSERT INTO collection_items (id, collection, item_order, data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, collection, order, jsonData, now, now)

  return { id, order, data, createdAt: now, updatedAt: now }
}

export function updateCollectionItem(
  id: string,
  data: Record<string, unknown>
): CollectionItem | null {
  const now = new Date().toISOString()
  const jsonData = JSON.stringify(data)

  const result = getDb().prepare(`
    UPDATE collection_items SET data = ?, updated_at = ? WHERE id = ?
  `).run(jsonData, now, id)

  if (result.changes === 0) return null

  const row = getDb().prepare('SELECT * FROM collection_items WHERE id = ?').get(id) as {
    id: string
    item_order: number
    data: string
    created_at: string
    updated_at: string
  }

  return {
    id: row.id,
    order: row.item_order,
    data: JSON.parse(row.data),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function deleteCollectionItem(id: string): boolean {
  const result = getDb().prepare('DELETE FROM collection_items WHERE id = ?').run(id)
  return result.changes > 0
}

export function reorderCollectionItems(collection: string, orderedIds: string[]): void {
  const stmt = getDb().prepare('UPDATE collection_items SET item_order = ? WHERE id = ?')
  const transaction = getDb().transaction(() => {
    orderedIds.forEach((id, index) => {
      stmt.run(index, id)
    })
  })
  transaction()
}

export function createMedia(id: string, filename: string, path: string): MediaFile {
  const now = new Date().toISOString()
  getDb().prepare(`
    INSERT INTO media (id, filename, path, uploaded_at) VALUES (?, ?, ?, ?)
  `).run(id, filename, path, now)
  return { id, filename, path, uploadedAt: now }
}

export function getMedia(id: string): MediaFile | null {
  const row = getDb().prepare('SELECT * FROM media WHERE id = ?').get(id) as {
    id: string
    filename: string
    path: string
    uploaded_at: string
  } | undefined

  if (!row) return null
  return { id: row.id, filename: row.filename, path: row.path, uploadedAt: row.uploaded_at }
}

export function getAllMedia(): MediaFile[] {
  const rows = getDb().prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all() as {
    id: string
    filename: string
    path: string
    uploaded_at: string
  }[]

  return rows.map(row => ({
    id: row.id,
    filename: row.filename,
    path: row.path,
    uploadedAt: row.uploaded_at,
  }))
}

export function deleteMedia(id: string): boolean {
  const result = getDb().prepare('DELETE FROM media WHERE id = ?').run(id)
  return result.changes > 0
}

export function getPreferences(): UserPreferences {
  const row = getDb().prepare('SELECT * FROM preferences WHERE id = ?').get('default') as {
    accent_hue: number
    theme: 'light' | 'dark'
  }
  return { accentHue: row.accent_hue, theme: row.theme }
}

export function updatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences()
  const updated = { ...current, ...prefs }

  getDb().prepare(`
    UPDATE preferences SET accent_hue = ?, theme = ? WHERE id = ?
  `).run(updated.accentHue, updated.theme, 'default')

  return updated
}
