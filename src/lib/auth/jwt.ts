// JWT utilities using jose
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

const JWT_EXPIRATION = '7d'; // 7 days

/**
 * Generate a JWT token for a user
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({
    userId: payload.userId,
    familyId: payload.familyId,
    firstName: payload.firstName,
    lastName: payload.lastName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as number,
      familyId: payload.familyId as number,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract token from request cookies
 */
export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const authCookie = cookies.find((c) => c.startsWith('auth-token='));

  if (!authCookie) return null;

  return authCookie.split('=')[1];
}
