export const forgotPasswordTemplate = (resetUrl: string, name: string) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
      <h2 style="color: #1e293b;">Reset Your Password</h2>
      <p style="color: #475569; font-size: 16px;">Hi ${name},</p>
      <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Sent from Your App Name</p>
    </div>
  `;
};
