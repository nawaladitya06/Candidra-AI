import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzlePostgres } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Explicitly import D1Database type from workers-types
import type { D1Database } from "@cloudflare/workers-types";

export function getDb() {
  // 1. Try Cloudflare D1 Binding (Primary as requested)
  const dbBinding = (process.env as any).DB as D1Database | undefined;
  if (dbBinding) {
    return drizzleD1(dbBinding, { schema });
  }

  // 2. Try Vercel Postgres / Neon fallback
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    return drizzlePostgres(sql, { schema });
  }

  // 3. Handle build-time scenarios
  return new Proxy({} as any, {
    get(_, prop) {
      if (prop === 'then') return undefined;
      return () => {
        throw new Error('Database accessed without valid D1 or Postgres bindings.');
      };
    }
  });
}
