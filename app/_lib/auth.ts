import NextAuth, { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { createGuest, getGuest } from './data-service'

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
    },
    async signIn({ user }) {
      try {
        if (!user.email) return false
        const existingGuest = await getGuest(user.email)
        if (!existingGuest && user.name && user.email)
          await createGuest({
            fullName: user.name,
            email: user.email,
          })
        return true
      } catch {
        return false
      }
    },
    async session({ session }) {
      const guest = await getGuest(session.user.email)
      session.user.guestId = guest.id
      return session
    },
  },
  pages: {
    signIn: 'login',
  },
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig)
