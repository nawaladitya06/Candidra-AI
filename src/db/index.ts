import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzlePostgres } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Explicitly import D1Database type from workers-types
import type { D1Database } from "@cloudflare/workers-types";

export function getDb() {
  // 1. Try Cloudflare D1 Binding
  const dbBinding = (process.env as any).DB as D1Database | undefined;
  if (dbBinding) {
    return drizzleD1(dbBinding, { schema });
  }

  // 2. Try Vercel Postgres / Neon (POSTGRES_URL is automatically set by Vercel)
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    return drizzlePostgres(sql, { schema });
  }

  // 3. Handle build-time or missing binding scenarios gracefully
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DB) {
    return new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'then') return undefined;
        return () => {
          throw new Error('Database accessed without valid bindings or environment variables (DB, POSTGRES_URL, or DATABASE_URL).');
        };
      }
    });
  }
  
  throw new Error('Database connection not found. Ensure you have configured D1 bindings or a Postgres connection string.');
}
