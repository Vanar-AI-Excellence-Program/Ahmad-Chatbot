import nodemailer from 'nodemailer';
import { env } from './env.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

export function generateVerificationEmailHtml(email: string, verificationCode: string, origin: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .verification-code { background: #e5e7eb; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Hello!</p>
          <p>Thank you for signing up. Please verify your email address by entering the verification code below:</p>
          
          <div class="verification-code">${verificationCode}</div>
          
          <p>Or click the button below to verify your email:</p>
          
          <a href="${origin}/verify-email?email=${encodeURIComponent(email)}&code=${verificationCode}" class="button">
            Verify Email
          </a>
          
          <p>This verification code will expire in 1 hour.</p>
          
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>This email was sent from ${origin}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
