import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose'
import type { AuthTokens, JWTPayload } from './types'

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

function getSecret() {
  const secret = process.env.CMS_JWT_SECRET
  if (!secret) {
    throw new Error('CMS_JWT_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
}

function getPassword() {
  const password = process.env.CMS_PASSWORD
  if (!password) {
    throw new Error('CMS_PASSWORD environment variable is required')
  }
  return password
}

export function validatePassword(input: string): boolean {
  return input === getPassword()
}

export async function generateTokens(): Promise<AuthTokens> {
  const secret = getSecret()
  const now = Math.floor(Date.now() / 1000)

  const accessToken = await new SignJWT({ type: 'access' } as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin')
    .setIssuedAt(now)
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret)

  const refreshToken = await new SignJWT({ type: 'refresh' } as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin')
    .setIssuedAt(now)
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(secret)

  return { accessToken, refreshToken }
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.type !== 'access') return null
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.type !== 'refresh') return null
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const payload = await verifyRefreshToken(refreshToken)
  if (!payload) return null

  const secret = getSecret()
  const accessToken = await new SignJWT({ type: 'access' } as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin')
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret)

  return accessToken
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
