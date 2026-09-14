import { NextRequest, NextResponse, ProxyConfig } from 'next/server'
import { VerifyUser } from './app/utils/session'

const publicRoutes = ['/', '/signin', '/menu',  '/about-us', '/contact-us', '/createaccount', '/forgot-password']
const userRoutes = ['/dashboard', '/dashboard/cart-order', '/dashboard/check-out', '/dashboard/check-out/success', '/dashboard/favourite', '/dashboard/menu', '/dashboard/order-history', '/dashboard/pending-orders', '/dashboard/profile']
const adminRoutes = ['/admin-dashboard', '/admin-dashboard/customers', '/admin-dashboard/orders', '/admin-dashboard/products',  '/admin-dashboard']

const matcherRoutes = (path: string, routes : string[]) =>{
    return routes.some(
        route => path === route || path.startsWith(`${route}/`)
    )
}

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isPublicRoute = matcherRoutes(path, publicRoutes);
    const isUserRoute = matcherRoutes(path, userRoutes);
    const isAdminRoute = matcherRoutes(path, adminRoutes);

    if (isPublicRoute) return NextResponse.next()

    const {success, user} =await VerifyUser()

    if (!success) {
        return NextResponse.redirect(new URL('/signin', req.nextUrl))
    }

    if(isUserRoute && user.role === 'admin') return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl))

    if(isAdminRoute && user.role !== 'admin') return NextResponse.redirect(new URL('/dashboard', req.nextUrl)) 


    return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: [ '/dashboard/:path*', '/admin-dashboard/:path*'],
}