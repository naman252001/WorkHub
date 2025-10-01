// utils/sendLink.js
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendLink = async ({ email, subject, message, link }) => {
  try {
    // Detect OTP and style it
    const otpMatch = message.match(/\b\d{4,8}\b/);
    const styledMessage = otpMatch
      ? message.replace(
          otpMatch[0],
          `<span style="font-size: 28px; font-weight: bold; color: #4CAF50;">${otpMatch[0]}</span>`
        )
      : message;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://yourdomain.com/logo.png" alt="Brand Logo" style="max-width: 150px; height: auto;">
          </div>
          <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">${subject}</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">${styledMessage}</p>
          ${
            link
              ? `<div style="text-align: center; margin-top: 20px;">
                   <a href="${link}" style="background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Click Here</a>
                 </div>`
              : ""
          }
          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      html: emailTemplate,
    };

    await sgMail.send(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email Send Error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendLink;
