// Setup API route for creating new family and first user
import { NextRequest, NextResponse } from 'next/server';
import { createFamily, createUser, getUserByFamilyAndName, getFamilyByName } from '@/lib/db/queries';
import { generateToken } from '@/lib/auth/jwt';
import type { SetupRequest } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: SetupRequest = await request.json();
    const { familyName, firstName, lastName, role } = body;

    // Validate input
    if (!familyName || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find existing family by name or create a new one
    let family = await getFamilyByName(familyName);

    if (!family) {
      family = await createFamily({ name: familyName });
    }

    // Check if user already exists within this family
    const existingUser = await getUserByFamilyAndName(family.id, firstName, lastName);
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this name already exists in this family. Please use the login page.' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser({
      family_id: family.id,
      first_name: firstName,
      last_name: lastName,
      role: role,
    });

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
      { status: 201 }
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
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during setup' },
      { status: 500 }
    );
  }
}
