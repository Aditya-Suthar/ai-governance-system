import type { IUser } from './models/User';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendVerificationEmail(user: IUser) {
  if (!user.emailVerificationToken) return;

  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(
    user.emailVerificationToken
  )}&email=${encodeURIComponent(user.email)}`;

  // Placeholder implementation:
  // In production, replace this with a real email provider (e.g. Nodemailer, Resend, SendGrid)
  console.log(
    `Email verification link for ${user.email}: ${verifyUrl}`
  );
}

