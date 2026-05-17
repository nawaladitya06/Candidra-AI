const fs = require('fs');

// Read env variables manually from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
    process.env[key] = value;
  }
});

const { getDb } = require('./src/db/index.ts');
const { users, accounts, sessions } = require('./src/db/schema.ts');

const db = getDb();

async function showStatus() {
  console.log('--- Current Database Records ---');
  try {
    const allUsers = await db.select().from(users).all();
    console.log('Users in database:', allUsers);
    
    const allAccounts = await db.select().from(accounts).all();
    console.log('Accounts in database:', allAccounts);

    const allSessions = await db.select().from(sessions).all();
    console.log('Sessions in database:', allSessions);
  } catch (err) {
    console.error('Database query failed:', err);
  }
}

showStatus();
