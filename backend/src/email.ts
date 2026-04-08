import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

interface LoginNotification {
  userName: string;
  userEmail: string;
  loginTime: Date;
  loginCount: number;
}

export async function sendLoginNotification(data: LoginNotification): Promise<void> {
  // Skip if email not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log('Email not configured, skipping login notification');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const time = data.loginTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: #2563eb; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">New Login Detected</h2>
        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">SaaS Dashboard</p>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">User</td>
            <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${data.userName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;">${data.userEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time</td>
            <td style="padding: 8px 0; font-size: 14px;">${time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Logins</td>
            <td style="padding: 8px 0; font-size: 14px;">${data.loginCount}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
          This is an automated notification from your SaaS Dashboard.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"SaaS Dashboard" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `Login Alert: ${data.userName} (${data.userEmail})`,
      html,
    });
    console.log(`Login notification sent to ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send login notification:', error);
  }
}
