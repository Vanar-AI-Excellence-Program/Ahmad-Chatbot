# Gmail Email Setup Guide

## 🔐 **Gmail Authentication Issues**

The error `535-5.7.8 Username and Password not accepted` occurs because Gmail requires special authentication for third-party applications.

## 📋 **Step-by-Step Solution**

### **1. Enable 2-Factor Authentication**

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)

### **2. Generate App Password**

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **Generate new app password**
5. Select **Mail** as the app type
6. Copy the generated 16-character password

### **3. Update Environment Variables**

Replace your current email settings in `.env`:

```env
# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=muhammad.ahmad@bigimmersive.com
EMAIL_SERVER_PASSWORD=your-16-character-app-password-here
EMAIL_FROM=muhammad.ahmad@bigimmersive.com
```

### **4. Alternative: Use Gmail OAuth2 (Recommended)**

For better security, consider using OAuth2 instead of App Passwords:

```env
# Gmail OAuth2 Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=muhammad.ahmad@bigimmersive.com
EMAIL_SERVER_PASSWORD=your-oauth2-token
EMAIL_FROM=muhammad.ahmad@bigimmersive.com
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Wrong Password**: Using regular Gmail password instead of App Password
2. **2FA Not Enabled**: Must enable 2-Factor Authentication first
3. **App Password Expired**: Generate a new App Password
4. **Account Security**: Google may block suspicious login attempts

### **Test Connection:**

The application now includes connection verification. Check the console for:

- ✅ `SMTP connection verified successfully`
- ✅ `Email sent successfully to: [email]`

### **Error Messages:**

- `EAUTH`: Authentication failed - check App Password
- `ECONNECTION`: Network/connection issues
- `ETIMEDOUT`: Connection timeout

## 🚀 **Quick Fix**

1. **Generate App Password** using the steps above
2. **Update your `.env` file** with the new App Password
3. **Restart the development server**
4. **Test email sending** by signing up with a new email

## 📧 **Testing**

After setup, test the email functionality:

1. Visit `http://localhost:5174/signup`
2. Enter a test email address
3. Submit the form
4. Check your email inbox for the verification link

## 🔒 **Security Notes**

- Never commit your App Password to version control
- Use environment variables for all sensitive data
- Consider using OAuth2 for production applications
- Regularly rotate App Passwords
