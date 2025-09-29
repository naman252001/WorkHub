const nodemailer = require("nodemailer");

const sendLink = async ({ email, subject, message, link }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Detect OTP pattern (4-8 digit number)
    const otpMatch = message.match(/\b\d{4,8}\b/);
    const styledMessage = otpMatch
      ? message.replace(
          otpMatch[0],
          `<span style="font-size: 28px; font-weight: bold; color: #4CAF50;">${otpMatch[0]}</span>`
        )
      : message;

    // Styled email template with logo
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Brand Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="http://localhost:5000/public/logo.png" alt="Brand Logo" style="max-width: 150px; height: auto;">
          </div>

          <!-- Email Title -->
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">${subject}</h2>

          <!-- Message -->
          <p style="font-size: 16px; color: #333; text-align: center;">${styledMessage}</p>

          <!-- Link Button -->
          ${
            link
              ? `<div style="text-align: center; margin-top: 20px;">
                   <a href="${link}" style="background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Click Here</a>
                 </div>`
              : ""
          }

          <!-- Footer -->
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Task Tracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email Send Error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendLink;
