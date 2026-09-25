import nodemailer from "nodemailer";
export async function sendVerificationEmail(to: string, token: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return false;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/verify?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Verify your Bristol Common account",
    text: `Verify your account: ${url}`,
    html: `<p>Welcome to Bristol Common.</p><p><a href="${url}">Verify your email address</a></p>`,
  });
  return true;
}
