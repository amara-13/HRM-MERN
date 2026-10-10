const mailer = require("nodemailer");

const getOtpEmailTemplate = (otp, userName = "User",otpExpire) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title-[#0F172A]>OTP Verification - PeopleHub HRM</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .main-container {
          max-width: 520px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #0a1329;
          padding: 24px 32px;
          text-align: center;
        }
        .logo-box {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          font-weight: bold;
          font-size: 20px;
          width: 36px;
          height: 36px;
          line-height: 36px;
          border-radius: 10px;
          vertical-align: middle;
          margin-right: 8px;
        }
        .brand-text {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          vertical-align: middle;
          letter-spacing: -0.5px;
        }
        .brand-highlight {
          color: #60a5fa;
          font-weight: 500;
          font-size: 16px;
        }
        .body-content {
          padding: 32px;
        }
        .title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 8px;
        }
        .subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 0;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .otp-box {
          background-color: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 14px;
          padding: 20px 16px;
          text-align: center;
          margin: 24px 0;
        }
        .otp-code {
          font-size: 34px;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: 12px;
          padding-left: 12px;
          margin: 0;
          font-family: 'Courier New', Courier, monospace;
        }
        .notice {
          background-color: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          color: #92400e;
          margin-bottom: 24px;
          line-height: 1.4;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px 32px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
          font-size: 12px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="main-container">
          
          <!-- Header Bar -->
          <div class="header">
            <span class="logo-box">P</span>
            <span class="brand-text">PeopleHub <span class="brand-highlight">HRM</span></span>
          </div>

          <!-- Body Content -->
          <div class="body-content">
            <h1 class="title">Verification Code</h1>
            <p class="subtitle">
              Hello <strong>${userName}</strong>,<br>
              Use the One-Time Password (OTP) below to complete your verification on <strong>PeopleHub HRM</strong>.
            </p>

            <!-- OTP Box -->
            <div class="otp-box">
              <p className="otp-label" style="margin:0 0 6px 0; font-size:12px; text-transform:uppercase; color:#64748b; font-weight:600; letter-spacing:1px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
            </div>

            <!-- Security Notice -->
            <div class="notice">
              ⏱️ This OTP is valid for <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone.
            </div>

            <p style="font-size:13px; color:#64748b; margin-bottom:0;">
              If you did not request this verification code, please ignore this email or contact support.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            &copy; ${new Date().getFullYear()} PeopleHub HRM System. All rights reserved.
          </div>

        </div>
      </div>    
    </body>
    </html>
  `;
};

const transportor = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendOtpMail = async (email, otp, name = "User", otpExpire) => {
  const mailOptions = {
    from: `"${process.env.APP_NAME || "PeopleHub HRM"}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otp} - PeopleHub HRM`,
    html: getOtpEmailTemplate(otp, name, otpExpire),
  };

  return await transportor.sendMail(mailOptions);
};

module.exports = { sendOtpMail };
