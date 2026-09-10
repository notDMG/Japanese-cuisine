import { signInSchema } from '@/schema/sign-in'
import { prisma } from '@/utils/prisma'
import getUserFromDb from '@/utils/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { ZodError } from 'zod'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error('Email and password are required')
          }

          const { email, password } = await signInSchema.parseAsync(credentials)

          const user = await getUserFromDb(email)

          if (!user || !user.password) {
            throw new Error('Invalid credentials')
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) throw new Error('Incorrect data entry')

          return { id: user.id, email: user.email }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
