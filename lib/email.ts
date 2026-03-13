import type { IUser } from "./models/User";
import { resend } from "@/lib/resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(user: IUser) {
  if (!user.emailVerificationToken) return;

  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(
    user.emailVerificationToken
  )}&email=${encodeURIComponent(user.email)}`;

  await resend.emails.send({
    from: "Project Zero Point <onboarding@resend.dev>",
    to: user.email,
    subject: "Verify your email - AI Governance System",
    html: `
      <h2>Verify your Email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}