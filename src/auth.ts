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
  // adapter: DrizzleAdapter(db, {
  //   usersTable: users as any,
  //   accountsTable: accounts as any,
  //   sessionsTable: sessions as any,
  // }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
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
    async signIn({ user }) {
      // Auto-upsert user in DB on every sign-in (adapter is disabled, so we do this manually)
      try {
        if (user?.email) {
          const [existing] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          if (!existing) {
            await db.insert(users).values({
              id: user.id || crypto.randomUUID(),
              name: user.name || null,
              email: user.email,
              image: user.image || null,
              plan: "free",
              interviewsCompleted: 0,
              codingRuns: 0,
            });
          }
        }
      } catch (e) {
        console.error("signIn auto-create error:", e);
        // Never block sign-in even if DB write fails
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    session({ session, token, user }) {
      if (session.user) {
        if (token) {
          session.user.id = (token.id || token.sub) as string;
          session.user.email = (token.email) as string;
          session.user.name = (token.name) as string;
          session.user.image = (token.picture || token.image) as string;
          (session.user as any).role = token.role || "user";
        } else if (user) {
          session.user.id = user.id;
          session.user.email = user.email;
          session.user.name = user.name;
          session.user.image = user.image;
          (session.user as any).role = (user as any).role || "user";
        }
        if (!session.user.id) {
          session.user.id = "unknown_id_fallback";
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: (process.env.AUTH_SECRET || "candidra_ai_temporary_secret_key_FORCE_LOGOUT_123!") + "_invalidated",
});
