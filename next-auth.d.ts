// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      guestId?: string // Add guestId as an optional property
    } & DefaultSession['user']
  }

  interface User {
    guestId?: string // Also add guestId to User if needed
  }
}
