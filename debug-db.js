import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set');
	process.exit(1);
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function debugDatabase() {
	try {
		console.log('🔍 Debugging database state...\n');

		// Check users table
		console.log('📋 USER TABLE:');
		const users = await client`SELECT * FROM "user" ORDER BY created_at DESC`;
		console.log(`Found ${users.length} users:`);
		users.forEach((user) => {
			console.log(
				`  - ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Created: ${user.created_at}`
			);
		});

		console.log('\n📋 ACCOUNT TABLE:');
		const accounts = await client`SELECT * FROM "account" ORDER BY "userId"`;
		console.log(`Found ${accounts.length} accounts:`);
		accounts.forEach((account) => {
			console.log(
				`  - UserID: ${account.userId}, Provider: ${account.provider}, Type: ${account.type}, Has Password: ${!!account.password}`
			);
		});

		console.log('\n📋 SESSION TABLE:');
		const sessions = await client`SELECT * FROM "session" ORDER BY expires DESC`;
		console.log(`Found ${sessions.length} sessions:`);
		sessions.forEach((session) => {
			console.log(
				`  - Token: ${session.sessionToken?.substring(0, 20)}..., UserID: ${session.userId}, Expires: ${session.expires}`
			);
		});

		console.log('\n🔍 RELATIONSHIPS:');
		if (users.length > 0 && accounts.length > 0) {
			console.log('User-Account relationships:');
			users.forEach((user) => {
				const userAccounts = accounts.filter((acc) => acc.userId === user.id);
				console.log(`  - User ${user.email} (${user.id}):`);
				userAccounts.forEach((acc) => {
					console.log(
						`    * Provider: ${acc.provider}, Type: ${acc.type}, Has Password: ${!!acc.password}`
					);
				});
			});
		}
	} catch (error) {
		console.error('❌ Database debug error:', error);
	} finally {
		await client.end();
	}
}

debugDatabase();
