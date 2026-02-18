import { DefaultSession } from 'next-auth'

// Modifying next-auth session user type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
