import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pb } from '@/lib/pocketbase';

// Paths that should be accessible even during maintenance
const ALLOWED_PATHS = [
  '/maintenance',
  '/auth/login',
  '/auth/logout',
  '/api',
  '/_next',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  // Check if the current path is in the allowed list
  const { pathname } = request.nextUrl;
  
  // Allow access to maintenance page and auth pages
  if (ALLOWED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Get the latest maintenance record
    const records = await pb.collection('maintenance').getList(1, 1, {
      sort: '-created'
    });
    
    // If maintenance mode is enabled, redirect to maintenance page
    if (records.items.length > 0) {
      const maintenance = records.items[0];
      if (maintenance.enabled) {
        const maintenanceUrl = new URL('/maintenance', request.url);
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    // In case of error, allow the request to proceed
    // You might want to change this behavior based on your requirements
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
};