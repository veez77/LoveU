// Authentication types

export interface JWTPayload {
  userId: number;
  familyId: number;
  firstName: string;
  lastName: string;
}

export interface Session {
  user: {
    id: number;
    familyId: number;
    firstName: string;
    lastName: string;
  };
}

export interface LoginRequest {
  firstName: string;
  lastName: string;
}

export interface SetupRequest {
  familyName: string;
  firstName: string;
  lastName: string;
  role: 'parent' | 'child';
}
