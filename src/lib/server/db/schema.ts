import { pgTable, uuid, text, timestamp, primaryKey, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull().default('User'),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('emailVerified'),
	image: text('image'),
	// Password is nullable because OAuth users won't have a password
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
	id: uuid('id').defaultRandom(),
	userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
	type: text('type').notNull(),
	provider: text('provider').notNull(),
	providerAccountId: text('providerAccountId').notNull(),
	// Password field removed - now stored in users table
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: integer('expires_at'),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state'),
}, (table) => ({
	compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

export const sessions = pgTable('sessions', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(), // Fixed: use mode: 'date' to match DrizzleAdapter expectations
});

export const verificationTokens = pgTable('verificationTokens', {
	identifier: text('identifier').notNull(),
	token: text('token').notNull(),
	expires: timestamp('expires', { mode: 'date' }).notNull(), // Fixed: use mode: 'date' to match DrizzleAdapter expectations
}, (table) => ({
	compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
}));
