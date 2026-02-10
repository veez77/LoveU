// Login API route
import { NextRequest, NextResponse } from 'next/server';
import { getUserByName } from '@/lib/db/queries';
import { generateToken } from '@/lib/auth/jwt';
import type { LoginRequest } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { firstName, lastName } = body;

    // Validate input
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Find user by name
    const user = await getUserByName(firstName, lastName);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please check your name or complete setup.' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      familyId: user.family_id,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          familyId: user.family_id,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
