# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth for your SvelteKit authentication app.

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: "Your App Name"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email)

### 3. Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Set authorized redirect URIs:
   - `http://localhost:5173/auth/callback/google` (development)
   - `https://yourdomain.com/auth/callback/google` (production)
5. Copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🐙 GitHub OAuth Setup

### 1. Create GitHub OAuth App
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - Application name: "Your App Name"
   - Homepage URL: `http://localhost:5173` (development)
   - Authorization callback URL: `http://localhost:5173/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID** and **Client Secret**

### 2. Update Environment Variables
Add to your `.env` file:
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 🚀 Testing OAuth

### Development Testing
1. Start your development server: `npm run dev`
2. Visit `http://localhost:5173/login`
3. Click "Continue with Google" or "Continue with GitHub"
4. Complete the OAuth flow
5. You should be redirected to `/profile`

### Common Issues

**Google OAuth Issues:**
- **"redirect_uri_mismatch"**: Check that your redirect URI exactly matches what's configured in Google Cloud Console
- **"invalid_client"**: Verify your Client ID and Client Secret are correct
- **"access_denied"**: Make sure you've added your email as a test user

**GitHub OAuth Issues:**
- **"redirect_uri_mismatch"**: Check that your callback URL matches exactly
- **"bad_verification_code"**: Usually means the Client Secret is incorrect

## 🔧 Environment Variables

Your complete `.env` file should look like this:

```env
# Database
DATABASE_URL=postgres://auth_user:password123@localhost:5432/auth_db

# Auth.js
AUTH_SECRET=your-long-random-secret-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# App Configuration
ORIGIN=http://localhost:5173
```

## 🛡️ Security Notes

1. **Never commit your OAuth secrets** to version control
2. **Use different OAuth apps** for development and production
3. **Rotate secrets regularly** for production apps
4. **Use environment variables** for all sensitive data

## 📱 Production Deployment

When deploying to production:

1. **Update redirect URIs** in both Google Cloud Console and GitHub OAuth App
2. **Use HTTPS** for all production URLs
3. **Set proper environment variables** on your hosting platform
4. **Test OAuth flow** in production environment

## 🎯 Features

With OAuth configured, users can:
- ✅ Sign in with Google
- ✅ Sign in with GitHub
- ✅ Sign in with email/password
- ✅ Create accounts via OAuth
- ✅ Access protected routes
- ✅ View their profile information

## 🔍 Troubleshooting

### Check OAuth Configuration
1. Verify all environment variables are set
2. Check redirect URIs match exactly
3. Ensure OAuth apps are properly configured
4. Test with different browsers

### Debug OAuth Flow
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check server logs for OAuth errors
4. Test with incognito/private browsing

### Common Error Messages
- `"invalid_client"`: Check Client ID/Secret
- `"redirect_uri_mismatch"`: Verify redirect URIs
- `"access_denied"`: Check OAuth app permissions
- `"bad_verification_code"`: Verify Client Secret
