const cron = require("node-cron");
const nodemailer = require("nodemailer");
const User = require("../models/User");
// Use dotenv for environment variables (assuming this file is sourced correctly)
require("dotenv").config(); 

// --- Email Transporter Setup (Using Explicit SMTP for robustness) ---
const transporter = nodemailer.createTransport({
    // Using explicit host/port is more stable than 'service: "gmail"'
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for 587 (TLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        // Allows connection to Gmail's server without strict certificate checks
        rejectUnauthorized: false 
    }
});

// Runs daily at 9:00 AM (0 minutes, 9 hours, any day of month/week/year)
cron.schedule("0 9 * * *", async () => {
    console.log("🎂 Running Birthday Cron job at 9:00 AM");

    try {
        const today = new Date();
        const month = today.getMonth() + 1; // 1-12
        const day = today.getDate();

        // Find all employees
        const employees = await User.find({ role: "Employee" });

        for (let emp of employees) {
            // Check for valid dateOfBirth field
            if (!emp.dateOfBirth) continue;

            const dob = new Date(emp.dateOfBirth);
            
            // Compare only the day and month (ignoring the year)
            if (dob.getDate() === day && dob.getMonth() + 1 === month) {
                
                const mailOptions = {
                    from: `"Work Sheet App" <${process.env.EMAIL_USER}>`,
                    to: emp.email,
                    subject: "🎉 Happy Birthday! Wishing you a Great Day!",
                    
                    // Simple fallback text for clients that don't display HTML
                    text: `Dear ${emp.name},\n\nWishing you a wonderful birthday from the Work Sheet App team! We hope you have a fantastic day celebrating.\n\nBest Regards,\nThe Work Sheet App Team`,
                    
                    // --- Great Birthday Wish (HTML Content) ---
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; background-color: #f9f9f9;">
                            <div style="background: linear-gradient(135deg, #ff9800, #ff5722); color: white; padding: 20px; text-align: center;">
                                <h1 style="margin: 0; font-size: 28px;">Happy Birthday, ${emp.name}!</h1>
                                <p style="font-size: 16px;">Time to celebrate you!</p>
                            </div>
                            <div style="padding: 30px; color: #333;">
                                <p style="font-size: 18px; line-height: 1.6;">
                                    The entire team at Work Sheet App sends you the warmest wishes on your special day.
                                    We truly appreciate your hard work and dedication.
                                </p>
                                <p style="font-size: 24px; text-align: center; color: #ff5722; font-weight: bold; margin: 30px 0;">
                                    🎂 Have a fantastic birthday! 🥳
                                </p>
                                <p style="font-size: 16px;">
                                    Wishing you joy and success today and all year long.
                                </p>
                            </div>
                            <div style="background-color: #eee; padding: 15px; text-align: center; font-size: 14px; color: #666;">
                                <p style="margin: 0;">Best Regards,<br>The Work Sheet App Team</p>
                            </div>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Birthday email sent to ${emp.name} (${emp.email})`);
            }
        }
    } catch (err) {
        console.error("⚠️ Error in Birthday Cron:", err);
    }
});
