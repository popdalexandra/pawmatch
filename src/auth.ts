import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AuthService } from "@/services/auth.service"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Delegate database verification to AuthService
          const user = await AuthService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          })

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        } catch {
          // Return null on invalid credentials to signal failure to NextAuth
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: UserRole }).role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        if (token.role) {
          session.user.role = token.role as UserRole
        }
      }
      return session
    },
  },

  session: {
    strategy: "jwt",
  },
})