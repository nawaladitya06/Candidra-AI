import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp' }),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const interviews = sqliteTable('interviews', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  experienceLevel: text('experienceLevel').notNull(),
  techStack: text('techStack').notNull(),
  status: text('status').notNull().default('in-progress'),
  score: integer('score'),
  communicationScore: integer('communicationScore'),
  technicalScore: integer('technicalScore'),
  confidenceScore: integer('confidenceScore'),
  duration: integer('duration'),
  feedback: text('feedback'),
  createdAt: text('createdAt').notNull(),
  completedAt: text('completedAt'),
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  interviewId: text('interviewId').notNull().references(() => interviews.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  answer: text('answer'),
  feedback: text('feedback'),
  score: integer('score'),
  type: text('type').notNull(),
});

export const codingSubmissions = sqliteTable('coding_submissions', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  code: text('code').notNull(),
  status: text('status').notNull(),
  runtime: real('runtime'),
  memory: real('memory'),
  score: integer('score'),
  createdAt: text('createdAt').notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  isRead: integer('isRead', { mode: 'boolean' }).notNull().default(0),
  createdAt: text('createdAt').notNull(),
});

export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('fileName').notNull(),
  fileKey: text('fileKey').notNull(),
  fileUrl: text('fileUrl').notNull(),
  parsedText: text('parsedText'),
  createdAt: text('createdAt').notNull().$defaultFn(() => new Date().toISOString()),
});
