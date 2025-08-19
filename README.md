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
GEMINI_API_KEY=your-gemini-api-key-here
```

8. **pnpm dev**

9. **Follow the local link** https://localhost:5173

## Features

- **User Authentication**: Sign up, sign in, and sign out
- **OAuth Integration**: Google and GitHub OAuth providers
- **Email Verification**: Email verification required for account activation
- **Database Sessions**: Secure session management with PostgreSQL
- **AI Chat Interface**: Powered by Google Gemini AI with professional UI
- **Role-Based Access Control**: Admin and user roles with admin dashboard
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and dark mode

## AI Chat Setup

To use the AI Chat feature, you'll need to:

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Add to Environment Variables**:
   - Add `GEMINI_API_KEY=your-actual-api-key` to your `.env` file

3. **Access the Chat**:
   - Navigate to `/chat` in your application
   - Start chatting with the AI assistant!

4. **Test API Connection**:
   - Visit `/api/chat/health` to test your Gemini API connection

### Troubleshooting

If you encounter API errors:

- **Model Not Found**: The app automatically tries `gemini-1.5-flash` first, then falls back to `gemini-pro`
- **API Key Issues**: Make sure your `GEMINI_API_KEY` is correctly set in `.env`
- **Quota Exceeded**: Check your Google AI Studio usage limits
- **Health Check**: Use `/api/chat/health` to diagnose connection issues

The chat interface includes:

- Real-time AI responses using Gemini 1.5 Flash (with fallback to Gemini Pro)
- Message history
- Loading states
- Error handling with detailed messages
- Professional UI with dark mode support
