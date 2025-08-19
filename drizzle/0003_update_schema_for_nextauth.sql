-- Update schema for NextAuth.js compatibility
-- Add password field to accounts table for credentials provider
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "password" text;

-- Remove password field from users table (this will be done after data migration)
-- ALTER TABLE "users" DROP COLUMN "password";
