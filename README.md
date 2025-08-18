# Auth App

A modern authentication application built with SvelteKit, Auth.js, and PostgreSQL.

## CI Status

[![CI](https://github.com/Vanar-AI-Excellence-Program/Ahmad-Chatbot/workflows/CI/badge.svg)](https://github.com/Vanar-AI-Excellence-Program/Ahmad-Chatbot/actions)

## QUICK SETUP

1. **git clone** https://github.com/Vanar-AI-Excellence-Program/Ahmad-Chatbot.git

2. **cd Ahmad-Chatbot**

3. **pnpm install**

4. **pnpm db:start**

5. **pnpm db:push**

6. **npx auth secret**

7. **Copy the env.example in .env file** - keep your existing DATABASE_URL and AUTH_SECRET only, paste these additional options from env.example into your .env file and change the values with yours:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

8. **pnpm dev**

9. **Follow the local link** https://localhost:5173

## Features

- **User Authentication**: Sign up, sign in, and sign out
- **OAuth Integration**: Google and GitHub OAuth providers
- **Email Verification**: Email verification required for account activation
- **Database Sessions**: Secure session management with PostgreSQL
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

