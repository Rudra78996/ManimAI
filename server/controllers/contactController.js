import nodemailer from "nodemailer";
import "dotenv/config";
export const sendContactMessage = async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ success: false, message: "Email and message are required." });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    });
    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_RECEIVER || process.env.GMAIL_USER,
      subject: `Contact Form Submission from ${email}`,
      text: message,
      html: `<p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message.replace(/\n/g, '<br/>')}</p>`
    });
    return res.status(200).json({ success: true, message: "Message sent!" });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
}; 