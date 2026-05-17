import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export function getDb() {
  // Try Vercel Postgres / Neon connection
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    return drizzle(sql, { schema });
  }

  // Handle build-time or fallback scenarios (avoid crashing Next.js static build)
  return new Proxy({} as any, {
    get(_, prop) {
      if (prop === 'then') return undefined;
      return () => {
        throw new Error('Database accessed without valid POSTGRES_URL or DATABASE_URL environment variables.');
      };
    }
  });
}
