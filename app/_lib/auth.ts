import NextAuth, { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

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
  },
}

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig)
