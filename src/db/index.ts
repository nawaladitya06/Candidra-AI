import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Explicitly import D1Database type from workers-types
import type { D1Database } from "@cloudflare/workers-types";

export function getDb() {
  const dbBinding = (process.env as any).DB as D1Database | undefined;

  if (dbBinding) {
    return drizzle(dbBinding, { schema });
  }

  // Handle build-time or missing binding scenarios gracefully
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DB) {
    // Return a proxy that only throws if actually accessed at runtime
    // This allows Next.js to import the module during build time
    return new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'then') return undefined; // Handle async/await checks
        return () => {
          throw new Error('Database accessed without valid bindings. Ensure you are in a Cloudflare environment.');
        };
      }
    });
  }
  
  throw new Error('Database binding not found. Ensure you are running in a Cloudflare environment.');
}
