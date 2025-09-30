// src/api/authApi.js
import axios from 'axios';

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://workhub-6jze.onrender.com', // Fallback to localhost:5000 for development
});

// Link-based Forgot Password API calls (Renamed for clarity)
export const requestResetLink = (email) => API.post('/api/auth/request-reset-link', { email });
// The function you need is renamed to resetPasswordLink
export const resetPasswordLink = (token, password) => API.post('/api/auth/reset-password', { token, password }); 
export const validateResetToken = (token) => API.get(`/api/auth/validate-reset-token/${token}`); // ADDED FOR USE IN ResetPassword.js

// NEW: OTP-based Forgot Password API calls
export const requestOtpForReset = (email) => API.post('/api/auth/request-otp-reset', { email });
export const resetPasswordWithOtp = (email, otp, password) => API.post('/api/auth/reset-password-otp', { email, otp, password });


// Existing Auth API calls
export const login = (email, password) => API.post('/api/auth/login', { email, password });
export const verifyOtp = (email, otp) => API.post('/api/auth/verify-otp', { email, otp });
export const signup = (userData) => API.post('/api/auth/signup', userData);

export default API;