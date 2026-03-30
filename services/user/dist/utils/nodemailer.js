"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});
const MailSender = async (data) => {
    // template
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;">

  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 5px 15px rgba(0,0,0,0.05);">
    
    <tr>
      <td align="center">
        <h2 style="margin:0; color:#333;">Email Verification</h2>
        <p style="color:#666; font-size:14px; margin-top:10px;">
          Use the verification code below to complete your sign up.
        </p>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:30px 0;">
        
        <!-- OTP Boxes -->
        <div style="letter-spacing:10px; font-size:28px; font-weight:bold; color:#007bff;">
          ${data.code}
        </div>

      </td>
    </tr>

    <tr>
      <td align="center">
        <p style="color:#999; font-size:13px;">
          This code will expire in 10 minutes.
        </p>

        <p style="color:#999; font-size:12px; margin-top:20px;">
          If you didn’t request this, please ignore this email.
        </p>
      </td>
    </tr>

  </table>

</body>
</html>
`;
    // sending mail configuration
    return await transporter.sendMail({
        from: `PCareer<${process.env.NODEMAILER_USER}>`,
        subject: `Verify as Recruiter`,
        to: `${data.to}`,
        html: htmlTemplate
    });
};
exports.MailSender = MailSender;
