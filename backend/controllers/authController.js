// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const sendLink = require("../utils/sendLink");

// // -----------------------------
// // Helper: Generate JWT
// // -----------------------------
// const generateToken = (userId) =>
//   jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Changed to 7d for consistency

// // -----------------------------
// // Signup (Manual Form Submission)
// // -----------------------------
// const signup = async (req, res) => {
//   const { name, email, password, rePassword, role } = req.body; // Removed googleId/microsoftId for manual signup

//   if (!name || !email || !password || !role)
//     return res.status(400).json({ msg: "Required fields missing" });

//   if (password !== rePassword)
//     return res.status(400).json({ msg: "Passwords do not match" });

//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       googleId: undefined, // Explicitly undefined for manual signup
//       microsoftId: undefined, // Explicitly undefined for manual signup
//     });

//     const token = generateToken(newUser._id);
//     res.status(201).json({ token, user: newUser });
//   } catch (err) {
//     console.error("Signup Error:", err);
//     res.status(500).json({ msg: err.message || "Server error" }); // Use err.message to show validation issues
//   }
// };

// // -----------------------------
// // Login with email/password
// // -----------------------------
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ msg: "Email and password are required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });
    
//     // Check if user has a password set (social accounts may not)
//     if (!user.password) return res.status(400).json({ msg: "This account was created via social login. Please use the social login button." });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     // Generate OTP for 10 minutes
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otpCode = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     // Send OTP email
//     await sendLink({
//       email,
//       subject: "Your OTP Code",
//       message: `Your OTP is ${otp}. Valid for 10 minutes.`,
//     });

//     res.json({ success: true, msg: "Password correct, OTP sent to email" });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // -----------------------------
// // Verify OTP
// // -----------------------------
// const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp)
//     return res.status(400).json({ msg: "Email and OTP are required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     if (!user.otpCode || user.otpCode !== otp || Date.now() > user.otpExpires) {
//       return res.status(400).json({ msg: "Invalid or expired OTP" });
//     }

//     // Clear OTP
//     user.otpCode = null;
//     user.otpExpires = null;
//     await user.save();

//     const token = generateToken(user._id);
//     res.json({ token, user });
//   } catch (err) {
//     console.error("Verify OTP Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // -----------------------------
// // Request OTP separately (Used for re-sending login OTP)
// // -----------------------------
// const requestOtp = async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ msg: "Email is required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });
     
//      // Check if user has a password set before sending OTP for login (prevents social users from misusing this)
//      if (!user.password) return res.status(400).json({ msg: "This account must use social login." });


//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otpCode = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendLink({
//       email,
//       subject: "Your OTP Code",
//       message: `Your OTP is ${otp}. Valid for 10 minutes.`,
//     });
    
    
//     res.json({ success: true, msg: "OTP sent to email" });
//   } catch (err) {
//     console.error("Request OTP Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // -----------------------------
// // Request Password Reset Link (Link-based reset, original forgotPassword)
// // -----------------------------
// const requestResetLink = async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ msg: "Email is required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     await sendLink({
//       email,
//       subject: "Password Reset Request",
//       message: `Click here to reset your password: ${resetLink}`,
//     });

//     res.json({ msg: "Password reset email sent successfully" });
//   } catch (err) {
//     console.error("Request Reset Link Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // -----------------------------
// // Reset Password (Link-based reset)
// // -----------------------------
// const resetPassword = async (req, res) => {
//   const { token, password } = req.body;
//   if (!token || !password) return res.status(400).json({ msg: "Token and password are required" });

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

//     user.password = await bcrypt.hash(password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();
//     res.json({ msg: "Password reset successful" });
//   } catch (err) {
//     console.error("Reset Password Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // -----------------------------
// // NEW: Request OTP for Password Reset (Step 1 of OTP Reset)
// // -----------------------------
// const requestOtpForReset = async (req, res) => {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ msg: "Email is required" });

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: "User not found" });

//         // Generate a new, separate OTP for password reset
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         // Storing it in the same fields as login OTP for simplicity
//         user.otpCode = otp;
//         user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//         await user.save();

//         await sendLink({
//             email,
//             subject: "Password Reset OTP",
//             message: `Your OTP for password reset is ${otp}. Valid for 10 minutes.`,
//         });

//         // Respond with success to move to the next step
//         res.json({ success: true, msg: "OTP sent to your email for password reset" });
//     } catch (err) {
//         console.error("Request OTP For Reset Error:", err);
//         res.status(500).json({ msg: "Server error" });
//     }
// };

// // -----------------------------
// // NEW: Reset Password with OTP (Step 2 of OTP Reset)
// // -----------------------------
// const resetPasswordWithOtp = async (req, res) => {
//     const { email, otp, password } = req.body;
//     if (!email || !otp || !password) return res.status(400).json({ msg: "Email, OTP, and new password are required" });

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: "User not found" });

//         // Validate OTP and Expiration
//         if (!user.otpCode || user.otpCode !== otp || Date.now() > user.otpExpires) {
//             return res.status(400).json({ msg: "Invalid or expired OTP" });
//         }

//         // Hash and save new password
//         user.password = await bcrypt.hash(password, 10);

//         // Clear OTP and reset link tokens to prevent reuse
//         user.otpCode = null;
//         user.otpExpires = null;
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;

//         await user.save();
//         res.json({ msg: "Password reset successful! You can now log in." });
//     } catch (err) {
//         console.error("Reset Password With OTP Error:", err);
//         res.status(500).json({ msg: "Server error" });
//     }
// };

// // -----------------------------
// // DEPRECATED: oauthLogin is no longer used for social signup/login with Passport
// // -----------------------------
// // const oauthLogin = async (req, res) => { /* ... */ };


// // -----------------------------
// // Validate Reset Token
// // -----------------------------
// const validateResetToken = async (req, res) => {
//   const { token } = req.params;

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

//     res.json({ msg: "Token is valid" });
//   } catch (err) {
//     console.error("Validate Token Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // -----------------------------
// // ✅ NEW: Finalize Social Signup (Called from the frontend form)
// // -----------------------------
// const completeSocialSignup = async (req, res) => {
//     const { email, name, role, password, confirmPassword, googleId, microsoftId } = req.body;

//     // Basic Validation
//     if (!email || !role || !password || !confirmPassword || (!googleId)) {
//         return res.status(400).json({ msg: "Missing required fields for account completion." });
//     }
//     if (password !== confirmPassword) {
//         return res.status(400).json({ msg: "Passwords do not match." });
//     }

//     try {
//         // 1. Double check user doesn't exist by email (safety check)
//         let existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ msg: "An account already exists with this email." });

//         // 2. Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // 3. Create the FINAL user record with the required Role
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role, // This is the user-selected role, which is validated by Mongoose
//             googleId: googleId || undefined
//         });

//         // 4. Issue the final JWT token
//         const token = generateToken(newUser._id);
//         res.status(201).json({ token, user: newUser, msg: "Account created successfully." });

//     } catch (err) {
//         console.error("Complete Social Signup Error:", err);
//         // This will catch the Mongoose ValidationError if the role is still wrong 
//         res.status(500).json({ msg: err.message || "Failed to finalize account creation." });
//     }
// };


// module.exports = {
//   signup,
//   login,
//   verifyOtp,
//   requestOtp,
//   requestResetLink,
//   resetPassword,
//   requestOtpForReset,
//   resetPasswordWithOtp,
//   validateResetToken,
//   // Explicitly export the new function
//   completeSocialSignup,
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendLink = require("../utils/sendLink");

// -----------------------------
// Helper: Generate JWT
// -----------------------------
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// -----------------------------
// Signup
// -----------------------------
const signup = async (req, res) => {
  const { name, email, password, rePassword, role } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ msg: "Required fields missing" });

  if (password !== rePassword)
    return res.status(400).json({ msg: "Passwords do not match" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      googleId: undefined,
      microsoftId: undefined,
    });

    const token = generateToken(newUser._id);
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

// -----------------------------
// Login with email/password
// -----------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.password)
      return res
        .status(400)
        .json({ msg: "This account was created via social login. Please use the social login button." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate OTP for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP email
    await sendLink({
      email,
      subject: "Your OTP Code",
      message: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    res.json({ success: true, msg: "Password correct, OTP sent to email" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// Verify OTP
// -----------------------------
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ msg: "Email and OTP are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.otpCode || user.otpCode !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// Request OTP separately
// -----------------------------
const requestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.password)
      return res
        .status(400)
        .json({ msg: "This account must use social login." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendLink({
      email,
      subject: "Your OTP Code",
      message: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    res.json({ success: true, msg: "OTP sent to email" });
  } catch (err) {
    console.error("Request OTP Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// Request Password Reset Link
// -----------------------------
const requestResetLink = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendLink({
      email,
      subject: "Password Reset Request",
      message: `Click here to reset your password: ${resetLink}`,
      link: resetLink,
    });

    res.json({ msg: "Password reset email sent successfully" });
  } catch (err) {
    console.error("Request Reset Link Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// Reset Password (link-based)
// -----------------------------
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ msg: "Token and password are required" });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// OTP-based Password Reset
// -----------------------------
const requestOtpForReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendLink({
      email,
      subject: "Password Reset OTP",
      message: `Your OTP for password reset is ${otp}. Valid for 10 minutes.`,
    });

    res.json({ success: true, msg: "OTP sent to your email for password reset" });
  } catch (err) {
    console.error("Request OTP For Reset Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password)
    return res
      .status(400)
      .json({ msg: "Email, OTP, and new password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.otpCode || user.otpCode !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otpCode = null;
    user.otpExpires = null;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ msg: "Password reset successful! You can now log in." });
  } catch (err) {
    console.error("Reset Password With OTP Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// Validate Reset Token
// -----------------------------
const validateResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    res.json({ msg: "Token is valid" });
  } catch (err) {
    console.error("Validate Token Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// -----------------------------
// Social Signup Completion
// -----------------------------
const completeSocialSignup = async (req, res) => {
  const { email, name, role, password, confirmPassword, googleId, microsoftId } =
    req.body;

  if (!email || !role || !password || !confirmPassword || !googleId) {
    return res
      .status(400)
      .json({ msg: "Missing required fields for account completion." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match." });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account already exists with this email." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      googleId: googleId || undefined,
    });

    const token = generateToken(newUser._id);
    res
      .status(201)
      .json({ token, user: newUser, msg: "Account created successfully." });
  } catch (err) {
    console.error("Complete Social Signup Error:", err);
    res
      .status(500)
      .json({ msg: err.message || "Failed to finalize account creation." });
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  requestOtp,
  requestResetLink,
  resetPassword,
  requestOtpForReset,
  resetPasswordWithOtp,
  validateResetToken,
  completeSocialSignup,
};
