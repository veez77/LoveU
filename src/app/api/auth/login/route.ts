// Login API route
import { NextRequest, NextResponse } from 'next/server';
import { getUserByFamilyAndName, getFamilyByName } from '@/lib/db/queries';
import { generateToken } from '@/lib/auth/jwt';
import type { LoginRequest } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { familyName, firstName, lastName } = body;

    // Validate input
    if (!familyName || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Family name, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Find family by name
    const family = await getFamilyByName(familyName);

    if (!family) {
      return NextResponse.json(
        { error: 'Family not found. Please check the family name or complete setup.' },
        { status: 404 }
      );
    }

    // Find user by name within the family
    const user = await getUserByFamilyAndName(family.id, firstName, lastName);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in this family. Please check your name or complete setup.' },
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
