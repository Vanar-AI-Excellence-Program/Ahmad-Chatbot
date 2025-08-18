// src/lib/server/env.ts
import dotenv from 'dotenv';

dotenv.config();

// // Load environment variables from .env file
// function loadEnv() {
//   try {
//     const envPath = join(process.cwd(), '.env');
//     const envContent = readFileSync(envPath, 'utf8');

//     const envVars: Record<string, string> = {};
//     envContent.split('\n').forEach(line => {
//       const [key, ...valueParts] = line.split('=');
//       if (key && !key.startsWith('#')) {
//         envVars[key.trim()] = valueParts.join('=').trim();
//       }
//     });

//     // Set environment variables
//     Object.assign(process.env, envVars);

//     console.log('✅ Environment variables loaded successfully');
//     return true;
//   } catch (error) {
//     console.error('❌ Failed to load .env file:', error);
//     return false;
//   }
// }

// // Load environment variables
// loadEnv();

export const env = {
	DATABASE_URL: process.env.DATABASE_URL,
	AUTH_SECRET: process.env.AUTH_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	ORIGIN: process.env.ORIGIN,
	// Email configuration
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASS: process.env.SMTP_PASS,
	SMTP_FROM: process.env.SMTP_FROM
};
