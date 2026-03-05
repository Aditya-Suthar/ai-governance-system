import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unknown error occurred' },
    { status: 500 }
  );
}

export async function validateAuthToken(request: Request) {
  const { getAuthUser } = await import('@/lib/auth');
  const user = await getAuthUser();
  
  if (!user) {
    throw new APIError(401, 'Unauthorized: Please log in');
  }
  
  return user;
}

export async function validateAuthorityRole(request: Request) {
  const user = await validateAuthToken(request);
  
  if (user.role !== 'authority') {
    throw new APIError(403, 'Forbidden: Only authorities can access this resource');
  }
  
  return user;
}
