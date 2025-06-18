export const EMAIL_VERIFY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
  <table style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
    <tr>
      <td>
        <h2 style="color: #2196F3;">Verify Your Email Address</h2>
        <p>Hi {{user_name}},</p>
        <p>Thanks for signing up with <strong>Manim AI</strong>! Please verify your email address using the code below:</p>
        <div style="font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0;">
          {{otp_code}}
        </div>
        <p>This code is valid for the next 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br><strong>Manim AI Team</strong></p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
export const RESET_PASSWORD_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
  <table style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
    <tr>
      <td>
        <h2 style="color: #f44336;">Password Reset Request</h2>
        <p>Hi {{user_name}},</p>
        <p>We received a request to reset the password for your <strong>Manim AI</strong> account.</p>
        <p>Use the OTP below to reset your password:</p>
        <div style="font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0;">
          {{otp_code}}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email or contact us at <a href="mailto:support@manim.ai">support@manim.ai</a>.</p>
        <p>Stay secure,<br><strong>Manim AI Team</strong></p>
      </td>
    </tr>
  </table>
</body>
</html>
`
export const WELCOME_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Manim AI</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
  <table style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
    <tr>
      <td>
        <h2 style="color: #4CAF50;">Welcome to Manim AI, {{user_name}}!</h2>
        <p>We're excited to have you with us.</p>
        <p>With Manim AI, you can create beautiful math animations effortlessly using AI. Whether you’re an educator, student, or creator – you’ll feel right at home.</p>
        <p><strong>Get started:</strong></p>
        <ul>
          <li>👉 Explore your dashboard</li>
          <li>📚 Check out our tutorials</li>
          <li>🤝 Join our creator community</li>
        </ul>
        <p>If you need any help, reply to this email or contact us at <a href="mailto:support@manim.ai">support@manim.ai</a>.</p>
        <p>Happy animating!<br><strong>– The Manim AI Team</strong></p>
      </td>
    </tr>
  </table>
</body>
</html>
`