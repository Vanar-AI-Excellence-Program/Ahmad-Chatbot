import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set');
	process.exit(1);
}

const client = postgres(process.env.DATABASE_URL);
// Database connection (not used in this script but kept for future use)

async function createAdmin() {
	try {
		console.log('🔧 Creating admin user...');

		// Check if admin already exists
		const existingAdmin = await client`
      SELECT * FROM users WHERE role = 'admin' LIMIT 1
    `;

		if (existingAdmin.length > 0) {
			console.log('✅ Admin user already exists:', existingAdmin[0].email);
			return;
		}

		// Create admin user
		const adminUser = await client`
      INSERT INTO users (name, email, role, "emailVerified", created_at, updated_at)
      VALUES ('Admin User', 'admin@example.com', 'admin', NOW(), NOW(), NOW())
      RETURNING *
    `;

		console.log('✅ Admin user created:', adminUser[0]);

		// Hash password
		const hashedPassword = await bcrypt.hash('admin123', 12);

		// Create admin credentials account
		await client`
      INSERT INTO accounts ("userId", type, provider, "providerAccountId", password)
      VALUES (${adminUser[0].id}, 'credentials', 'credentials', ${adminUser[0].id}, ${hashedPassword})
    `;

		console.log('✅ Admin credentials account created');
		console.log('🔑 Admin login credentials:');
		console.log('   Email: admin@example.com');
		console.log('   Password: admin123');
		console.log('⚠️  Please change these credentials after first login!');
	} catch (error) {
		console.error('❌ Error creating admin:', error);
	} finally {
		await client.end();
	}
}

createAdmin();
