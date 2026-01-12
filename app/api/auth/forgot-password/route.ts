import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { forgotPasswordTemplate } from "@/lib/email-template";

const resend = new Resend(process.env.RES_EMAIL_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // Security Tip: Even if user doesn't exist, return success to prevent "email fishing"
    if (!user) {
      return NextResponse.json({
        message: "If an account exists, an email has been sent.",
      });
    }

    // Generate a secure token and 1-hour expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetToken, // Ensure your Prisma schema has this field
        resetTokenExpires: expiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send the email
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Replace with your verified domain in production
      to: email,
      subject: "Password Reset Request",
      html: forgotPasswordTemplate(resetUrl, user.name || "User"),
    });

    return NextResponse.json({ message: "Reset link sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
