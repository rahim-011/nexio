import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from 'better-auth/cookies'
import { globalLimiter } from "@/lib/rate-limit";

const protectedRoutes = ['/settings','/messages','/profile','/add-friends','/requests'];

export async function proxy(req:NextRequest) {
    const pathname = req.nextUrl.pathname;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success, reset } = await globalLimiter.limit(ip);
    if (!success) {
        return NextResponse.json(
            { message: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(
                        Math.max(1, Math.ceil((reset - Date.now()) / 1000))
                    ),
                },
            }
        );
    }
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    if (!isProtectedRoute){
        return NextResponse.next();
    }
    const sessionCookie = getSessionCookie(req);
    if (!sessionCookie){
        const signInUrl = new URL("/sign-in",req.url);
        signInUrl.searchParams.set("callbackUrl",pathname);
        return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
}


export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};