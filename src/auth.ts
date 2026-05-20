import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "./db";
import { users, accounts, sessions } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const db = getDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts as any,
    sessionsTable: sessions as any,
  }),
  providers: [
    Google,
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email as string))
          .limit(1);

        if (user && user.password) {
          const isValid = await bcrypt.compare(
            password as string,
            user.password
          );
          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
