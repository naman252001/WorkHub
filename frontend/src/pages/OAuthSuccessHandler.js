import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to decode JWT token to get unverified user data
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
};

// Component to handle the final token redirect after successful social login (existing user)
const OAuthSuccessHandler = ({ onLogin }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("Authenticating...");

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (token) {
            try {
                // 1. Store the JWT token
                localStorage.setItem('token', token);

                // 2. Decode token payload to get user ID and potentially fetch profile (best practice)
                const decodedPayload = decodeToken(token);

                if (decodedPayload && decodedPayload.id) {
                    // 3. (Optional but Recommended) Fetch the full user profile using the token
                    // For simplicity, we'll use the token's payload to set the state here.
                    // In a real app, you would hit an /api/user/me endpoint.
                    
                    setStatusMessage("Login successful. Redirecting to dashboard...");
                    
                    // Since the token only contains the ID, we need to fetch the full user object
                    // For now, we'll mock the user object until you implement the /me endpoint
                    
                    const user = { 
                        _id: decodedPayload.id, 
                        name: "Social User", 
                        email: "social@example.com", 
                        role: "Employee" // Default, update this when fetching full profile
                    };

                    // Note: If you have a separate API endpoint to fetch the user 
                    // details (e.g., axios.get('/api/user/me')), use that here. 
                    // For now, setting a placeholder to allow navigation.
                    
                    // 4. Update the main App state
                    onLogin(user);

                    // 5. Determine redirect path
                    const dashboardPath = user.role === "Manager" ? "/manager" : "/employee";
                    navigate(dashboardPath, { replace: true });
                    
                } else {
                    setStatusMessage("Token received, but failed to parse user data. Please try again.");
                    setTimeout(() => navigate('/login'), 3000);
                }

            } catch (error) {
                console.error("OAuth Handler Error:", error);
                setStatusMessage("An unexpected error occurred during login. Please try again.");
                setTimeout(() => navigate('/login'), 3000);
            }
        } else {
            setStatusMessage("Authentication token not found in URL. Redirecting to login.");
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [location.search, navigate, onLogin]);

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-gray-900">
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    Social Login
                </h1>
                <p className="text-gray-700 dark:text-gray-300">{statusMessage}</p>
                {/* Simple loading spinner */}
                {statusMessage.includes("Redirecting") && (
                    <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                )}
            </div>
        </div>
    );
};

export default OAuthSuccessHandler;
