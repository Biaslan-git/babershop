export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'image'
  | 'color'
  | 'select'
  | 'json'
  | 'date'
  | 'time'
  | 'schedule'
  | 'keyvalue'

export interface FieldDefinition {
  type: FieldType
  label: string
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  rows?: number
  options?: { value: string; label: string }[]
}

export interface SectionSchema {
  [fieldName: string]: FieldDefinition
}

export interface CollectionSchema {
  [fieldName: string]: FieldDefinition
}

export interface CMSSchema {
  sections: Record<string, SectionSchema>
  collections: Record<string, CollectionSchema>
}

export interface SectionContent {
  id: string
  data: Record<string, unknown>
  updatedAt: string
}

export interface CollectionItem {
  id: string
  order: number
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Collection {
  name: string
  items: CollectionItem[]
  updatedAt: string
}

export interface MediaFile {
  id: string
  filename: string
  path: string
  uploadedAt: string
}

export interface UserPreferences {
  accentHue: number
  theme: 'light' | 'dark'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JWTPayload {
  sub: string
  exp: number
  type: 'access' | 'refresh'
}
