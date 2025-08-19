-- Rename tables to match DrizzleAdapter expectations
ALTER TABLE "users" RENAME TO "user";
ALTER TABLE "accounts" RENAME TO "account";
ALTER TABLE "sessions" RENAME TO "session";
ALTER TABLE "verificationTokens" RENAME TO "verificationToken";
