import { pgTable, uuid, text, timestamp, primaryKey, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull().default('User'),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('emailVerified'),
	image: text('image'),
	// Role field for RBAC - default to 'user', can be 'admin'
	role: text('role').notNull().default('user'),
	// Password removed from users table - now stored in accounts table for credentials provider
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const accounts = pgTable(
	'account',
	{
		id: uuid('id').defaultRandom(),
		userId: uuid('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		// Password field for credentials provider
		password: text('password'),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(table) => ({
		compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] })
	})
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: uuid('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date', withTimezone: true }).notNull()
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date', withTimezone: true }).notNull()
	},
	(table) => ({
		compoundKey: primaryKey({ columns: [table.identifier, table.token] })
	})
);
