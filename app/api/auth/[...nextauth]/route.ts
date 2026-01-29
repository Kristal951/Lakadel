import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          currency: user.currency,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = (user as any).id;
      token.currency = (user as any).currency ?? "NGN";
      token.role = (user as any).role ?? "USER";
    }

    if (!token.role && token.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email as string },
        select: { role: true, currency: true },
      });
      token.role = dbUser?.role ?? "USER";
      token.currency = token.currency ?? dbUser?.currency ?? "NGN";
    }

    return token;
  },

  async session({ session, token }) {
    (session.user as any).id = token.id;
    (session.user as any).currency = token.currency ?? "NGN";
    (session.user as any).role = token.role ?? "USER";

    return session;
  },
},

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
