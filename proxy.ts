import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {pb} from '@/lib/pocketbase';

// Paths that should be accessible even during maintenance
const ALLOWED_PATHS = [
    '/maintenance',
    '/auth/login',
    '/auth/logout',
    '/api',
    '/_next',
    '/favicon.ico',
];

let consecutiveDbFailures = 0;

export async function proxy(request: NextRequest) {
    const {pathname} = request.nextUrl;

    if (ALLOWED_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    } else if (consecutiveDbFailures >= 4) {
        consecutiveDbFailures = 0;
    }

    let success = false;
    while (!success && consecutiveDbFailures < 4) {
        try {
            const records = await pb.collection('maintenance').getList(1, 1, {
                sort: '-created'
            });
            success = true;
            if (records.items.length > 0) {
                const maintenance = records.items[0];
                if (maintenance.enabled) {
                    success = true;
                    consecutiveDbFailures = 0;
                    const maintenanceUrl = new URL('/maintenance', request.url);
                    return NextResponse.redirect(maintenanceUrl);
                }
            }
            consecutiveDbFailures = 0;
        } catch (error) {
            console.error('Error checking maintenance status:', error);
            consecutiveDbFailures++;
            if (consecutiveDbFailures >= 4) {
                const maintenanceUrl = new URL('/maintenance', request.url);
                return NextResponse.redirect(maintenanceUrl);
            }
        }
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