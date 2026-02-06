import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Tenta pegar o token dos cookies
  const token = request.cookies.get('token')?.value;

  const signInUrl = new URL('/login', request.url);
  const dashboardUrl = new URL('/', request.url);

  // Define quais rotas são públicas (não precisam de token)
  const isPublicRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

  // Se NÃO tem token e está tentando acessar rota privada -> Manda pro Login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(signInUrl);
  }

  // Se JÁ tem token e está tentando acessar Login ou Register -> Manda pra Dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(dashboardUrl);
  }

  // Se nada disso acontecer, deixa passar
  return NextResponse.next();
}

export const config = {
  // Esse regex louco diz: "Rode em tudo, MENOS nas rotas de API, arquivos estáticos, imagens e favicon"
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};