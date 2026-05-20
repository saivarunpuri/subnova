import nodemailer from 'nodemailer';

// Using Brevo (formerly Sendinblue) SMTP — free tier: 300 emails/day
// Sign up at: https://app.brevo.com → SMTP & API → SMTP tab → Generate SMTP key
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_EMAIL,       // Your Brevo login email
    pass: process.env.SMTP_APP_PASSWORD, // Brevo SMTP Key (not your login password!)
  },
});

interface PaymentUser {
  name: string;
  email: string;
}

/**
 * Sends an email to the admin when a user submits a payment screenshot.
 */
export const notifyAdminOfPayment = async (
  user: PaymentUser,
  bundleTitle: string,
  amount: number,
  screenshotUrl: string,
  paymentId: string
) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.SMTP_APP_PASSWORD || process.env.SMTP_APP_PASSWORD === 'YOUR_GMAIL_APP_PASSWORD_HERE') {
    console.warn('[EmailService] SMTP not configured. Skipping admin notification.');
    return;
  }

  const screenshotLink = screenshotUrl.startsWith('http')
    ? screenshotUrl
    : `http://localhost:5000${screenshotUrl}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0d0b18; color: #e0e0e0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #14112a; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #7c3aed, #3b82f6); padding: 32px 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 32px 40px; }
        .badge { display: inline-block; background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
        .info-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { color: #ffffff; font-size: 13px; font-weight: 600; }
        .cta-btn { display: block; text-align: center; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin: 24px 0 0; }
        .footer { text-align: center; padding: 20px 40px; color: rgba(255,255,255,0.2); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.05); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💸 New Payment Submitted</h1>
          <p>A user is awaiting your approval on OTTBundle</p>
        </div>
        <div class="body">
          <div class="badge">⚡ Requires Your Action</div>
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">User Name</span>
              <span class="info-value">${user.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">User Email</span>
              <span class="info-value">${user.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Bundle / Pack</span>
              <span class="info-value">${bundleTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Amount Paid</span>
              <span class="info-value">₹${amount}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment ID</span>
              <span class="info-value" style="font-family:monospace;font-size:11px;">${paymentId}</span>
            </div>
          </div>
          <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:12px;">The user has uploaded their payment screenshot for verification. Click the link below to view it, then log in to your Control Center to Approve or Reject.</p>
          <a href="${screenshotLink}" class="cta-btn">📎 View Payment Screenshot</a>
        </div>
        <div class="footer">OTTBundle Admin System &bull; ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"OTTBundle System" <${process.env.SMTP_EMAIL}>`,
    to: adminEmail,
    subject: `[OTTBundle] Payment Alert: ${user.name} submitted a screenshot`,
    html,
  });

  console.log(`[EmailService] Admin notified for payment ${paymentId}`);
};

/**
 * Sends OTT credentials to a user after their payment is approved.
 */
export const sendUserOTTCredentials = async (
  userEmail: string,
  userName: string,
  bundleTitle: string,
  ottUsername: string,
  ottPassword: string
) => {
  if (!process.env.SMTP_APP_PASSWORD || process.env.SMTP_APP_PASSWORD === 'YOUR_GMAIL_APP_PASSWORD_HERE') {
    console.warn('[EmailService] SMTP not configured. Skipping user credential email.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0d0b18; color: #e0e0e0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #14112a; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #059669, #0d9488); padding: 32px 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 32px 40px; }
        .badge { display: inline-block; background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); color: #34d399; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
        .creds-card { background: rgba(52,211,153,0.05); border: 2px solid rgba(52,211,153,0.2); border-radius: 16px; padding: 24px; margin-bottom: 20px; text-align: center; }
        .creds-label { color: rgba(255,255,255,0.4); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .creds-value { color: #ffffff; font-size: 20px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 2px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 16px; display: inline-block; margin-top: 4px; }
        .info-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .info-value { color: #ffffff; font-size: 13px; font-weight: 600; }
        .warning { background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); border-radius: 12px; padding: 14px 18px; color: rgba(251,191,36,0.8); font-size: 12px; margin-top: 16px; }
        .footer { text-align: center; padding: 20px 40px; color: rgba(255,255,255,0.2); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.05); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Payment Approved!</h1>
          <p>Your OTT subscription is now active</p>
        </div>
        <div class="body">
          <div class="badge">✅ Access Granted</div>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:24px;">Hi <strong style="color:white;">${userName}</strong>! Your payment for <strong style="color:#a78bfa;">${bundleTitle}</strong> has been verified and approved. Here are your login credentials:</p>
          
          <div class="creds-card">
            <div style="margin-bottom:16px;">
              <div class="creds-label">Username / Email</div>
              <div class="creds-value">${ottUsername}</div>
            </div>
            <div>
              <div class="creds-label">Password</div>
              <div class="creds-value">${ottPassword}</div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-row">
              <span class="info-label">Bundle</span>
              <span class="info-value">${bundleTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Approved On</span>
              <span class="info-value">${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
            </div>
          </div>

          <div class="warning">
            ⚠️ Keep these credentials safe. Do not share them with anyone. If you face issues logging in, contact us by replying to this email.
          </div>
        </div>
        <div class="footer">OTTBundle &bull; Thank you for your subscription!</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"OTTBundle" <${process.env.SMTP_EMAIL}>`,
    to: userEmail,
    subject: `[OTTBundle] ✅ Your ${bundleTitle} credentials are here!`,
    html,
  });

  console.log(`[EmailService] Credentials sent to ${userEmail}`);
};
