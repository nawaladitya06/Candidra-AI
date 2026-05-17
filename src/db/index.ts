import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

export function getDb() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_D1_TOKEN;

  if (accountId && databaseId && apiToken) {
    return drizzle(async (sql, params, method) => {
      try {
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
              sql,
              params,
            }),
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`D1 HTTP query failed with status ${res.status}: ${errText}`);
        }

        const data = await res.json() as any;

        if (!data.success) {
          throw new Error(`D1 HTTP query returned success=false: ${JSON.stringify(data.errors)}`);
        }

        const queryResult = data.result?.[0];
        const rows = queryResult?.rows || [];

        if (method === 'get') {
          return { rows: rows[0] || [] };
        }

        return { rows };
      } catch (error) {
        console.error('D1 Proxy Error:', error);
        throw error;
      }
    }, { schema });
  }

  // Handle build-time or fallback scenarios (avoid crashing Next.js static build)
  return new Proxy({} as any, {
    get(_, prop) {
      if (prop === 'then') return undefined;
      return () => {
        throw new Error(
          'Database accessed without valid CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_D1_TOKEN environment variables.'
        );
      };
    }
  });
}
