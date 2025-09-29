const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

const {
  signup,
  login,
  requestOtp,
  verifyOtp,
  requestResetLink,
  resetPassword,
  requestOtpForReset,
  resetPasswordWithOtp,
  validateResetToken,
  // NEW: Function to finalize social signup
  completeSocialSignup 
} = require("../controllers/authController");

function generateToken(user) {
  // Use the environment variable for the secret key
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ======================================
// Standard Auth Routes
// ======================================

// ✅ Manual Signup
router.post("/signup", signup);

// ✅ Step 1: Login with email/password (sends OTP)
router.post("/login", login);

// ✅ Step 2: Verify OTP and return token
router.post("/verify-otp", verifyOtp);

// ✅ Request OTP separately (for re-sending login OTP)
router.post("/request-otp", requestOtp);

// ======================================
// Forgot/Reset Password (Link-based)
// ======================================

router.post("/request-reset-link", requestResetLink);
router.post("/reset-password", resetPassword);
router.get("/validate-reset-token/:token", validateResetToken);

// ======================================
// Forgot/Reset Password (OTP-based)
// ======================================

router.post("/request-otp-reset", requestOtpForReset);
router.post("/reset-password-otp", resetPasswordWithOtp);

// ======================================
// Social Auth (Google & Microsoft)
// ======================================

// ✅ Google Auth Start
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Note: You would add Microsoft routes here if implementing:
// router.get("/microsoft", passport.authenticate("microsoft", { scope: ["user.read"] }));

// ✅ Google Auth Callback (Handles Social Sign-up Augmentation)
router.get(
 "/google/callback",
 passport.authenticate("google", { failureRedirect: "/login" }),
 (req, res) => {
    // 1. Check if the user is a temporary object (new social user)
   if (req.user.isNewSocialUser) {
      // Package temporary data
      const data = { 
          email: req.user.email, 
          name: req.user.name, 
          googleId: req.user.googleId 
      };
      
      // Encode the data to pass safely in the URL to the frontend form
      const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
      
      // Redirect to the frontend completion route
      return res.redirect(`${process.env.FRONTEND_URL}/social-signup-complete?data=${encodedData}`);
   } else {
      // 2. Existing User: Generate token and proceed
      const token = generateToken(req.user);
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
   }
 }
);

// ======================================
// ✅ NEW: Endpoint to finalize social signup
// ======================================

router.post("/complete-social-signup", completeSocialSignup);

module.exports = router;