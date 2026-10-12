import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo aplicar a rutas privadas del panel administrativo
  if (pathname.startsWith("/admin/dashboard")) {
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some((cookie: { name: string; value: string }) =>
      cookie.name.includes("auth-token") || cookie.name.startsWith("sb-")
    );

    if (!hasAuthCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/dashboard"],
};
