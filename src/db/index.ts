import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(runtime: 'edge' | 'nodejs' = 'edge') {
  // In Cloudflare, we access D1 via env.DB
  // For local development, wrangler provides a mock
  if (process.env.DB) {
    return drizzle(process.env.DB as unknown as D1Database, { schema });
  }
  
  throw new Error('Database binding not found. Ensure you are running in a Cloudflare environment.');
}
