import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./AuthForm.css";

// Use the correct backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SocialSignupComplete = ({ onLogin }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Initial state for the required fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        googleId: '', 
        microsoftId: '',
        role: '',
        password: '',
        confirmPassword: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Extract and Decode Data on Load
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const encodedData = query.get('data');

        if (!encodedData) {
            setError("Missing social data. Redirecting to login.");
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        try {
            // Base64 decode the string and parse the JSON
            const decodedJson = atob(encodedData);
            const userData = JSON.parse(decodedJson);
            
            // Set the extracted data into the state
            setFormData(prev => ({
                ...prev,
                // Ensure we merge only relevant social IDs
                ...userData,
                // If the user data contains both, it favors the one passed
                googleId: userData.googleId || prev.googleId,
            }));

        } catch (e) {
            console.error("Error decoding social data:", e);
            setError("Invalid social data format. Please try logging in again.");
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [location.search, navigate]);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (!formData.role) {
            setError("Please select a role.");
            setIsLoading(false);
            return;
        }

        try {
            // 2. Submit the FINAL data to the new backend endpoint
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/complete-social-signup`, 
                {
                    name: formData.name,
                    email: formData.email,
                    googleId: formData.googleId,
                    role: formData.role,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }
            );

            // 3. Handle Success: Store token, update app state, and redirect
            const { token, user } = response.data;
            localStorage.setItem('token', token); // Store JWT token
            onLogin(user); // Update the global app state with user data

            // Redirect based on the user's selected role
            navigate(user.role === "Manager" ? "/manager" : "/employee");

        } catch (err) {
            console.error("Final Signup Error:", err);
            // Replace alert with setting the error state
            setError(err.response?.data?.msg || "Failed to complete signup.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show a minimal message if data hasn't loaded or an error occurred
    if (error || !formData.email) {
        return (
            <div className="auth-wrapper">
                <div className="cont s--signup">
                    <div className="form sign-up">
                        <h2 style={{color: error ? 'red' : 'inherit'}}>{error || "Loading User Data..."}</h2>
                        {error && <p>Please wait or return to the <Link to="/login">login page</Link>.</p>}
                    </div>
                </div>
            </div>
        );
    }
    
    // Main form rendering
    return (
        <div className="auth-wrapper">
            {/* Using .cont s--signup and .form sign-up for styling consistency */}
            <div className="cont s--signup">
                <div className="form sign-up">
                    <h2>Welcome, <strong>{formData.name}</strong></h2>
                    <p>! Please choose your role and set a secure password.</p>
                    
                    
                    <form onSubmit={handleSubmit}>
                        
                        {/* Read-only fields */}
                        {/* <label>
                            <span>Email </span>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                readOnly
                                style={{backgroundColor: '#f0f0f0', cursor: 'default'}}
                            />
                        </label> */}

                        {/* Role Selection */}
                        <label>
                            <span>Role</span>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </label>

                        {/* Password Input */}
                        <label>
                            <span>Password</span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </label>

                        {/* Confirm Password Input */}
                        <label>
                            <span>Confirm Password</span>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </label>
                        
                        {/* Error Message */}
                        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

                        {/* Submit Button */}
                        <div className="form-buttons">
                            <button type="submit" className="submit" disabled={isLoading}>
                                {isLoading ? 'Finalizing...' : 'Complete Signup'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SocialSignupComplete;
