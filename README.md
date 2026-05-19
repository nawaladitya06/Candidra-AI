# Candidra AI - Full Stack Project

This project is divided into two main components:

## 📂 Project Structure

- **`/frontend`**: The main Next.js 16 application. This handles the UI, authentication, and the primary user experience. It is optimized for deployment on **Vercel**.
- **`/backend`**: A Cloudflare Workers-based backend service. This handles specialized tasks and API logic separate from the main frontend.

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 🛠️ Technologies
- **Frontend**: Next.js 16, Tailwind CSS, Drizzle ORM, Vercel Postgres.
- **Backend**: Hono, Cloudflare Workers, Cloudflare D1.
