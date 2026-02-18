export { default } from 'next-auth/middleware'

// Auth.JS (next auth) middleware regex config
export const config = {
  matcher: ['/dashboard/:path*'],
}
