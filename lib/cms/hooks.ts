'use client'

import { useState, useEffect } from 'react'
import type { SectionContent, CollectionItem } from './types'

export function useSection(sectionId: string) {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSection() {
      try {
        const res = await fetch(`/api/cms/content?id=${sectionId}`)
        if (res.ok) {
          const section: SectionContent = await res.json()
          setData(section.data)
        }
      } catch {
        // Keep null
      } finally {
        setIsLoading(false)
      }
    }
    fetchSection()
  }, [sectionId])

  return { data, isLoading }
}

export function useCollection<T = Record<string, unknown>>(collectionName: string) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCollection() {
      try {
        const res = await fetch(`/api/cms/collections?collection=${collectionName}`)
        if (res.ok) {
          const data: CollectionItem[] = await res.json()
          setItems(data.map(item => ({ id: item.id, ...item.data })) as T[])
        }
      } catch {
        // Keep empty
      } finally {
        setIsLoading(false)
      }
    }
    fetchCollection()
  }, [collectionName])

  return { items, isLoading }
}
