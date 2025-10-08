// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import "./AuthForm.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const SocialSignupComplete = ({ onLogin }) => {
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     // Initial state for the required fields
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         googleId: '', 
//         microsoftId: '',
//         role: '',
//         password: '',
//         confirmPassword: '',
//     });
    
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // 1. Extract and Decode Data on Load
//     useEffect(() => {
//         const query = new URLSearchParams(location.search);
//         const encodedData = query.get('data');

//         if (!encodedData) {
//             setError("Missing social data. Redirecting to login.");
//             setTimeout(() => navigate('/login'), 3000);
//             return;
//         }

//         try {
//             // Base64 decode the string and parse the JSON
//             const decodedJson = atob(encodedData);
//             const userData = JSON.parse(decodedJson);
            
//             // Set the extracted data into the state
//             setFormData(prev => ({
//                 ...prev,
//                 // Ensure we merge only relevant social IDs
//                 ...userData,
//                 // If the user data contains both, it favors the one passed
//                 googleId: userData.googleId || prev.googleId,
//             }));

//         } catch (e) {
//             console.error("Error decoding social data:", e);
//             setError("Invalid social data format. Please try logging in again.");
//             setTimeout(() => navigate('/login'), 3000);
//         }
//     }, [location.search, navigate]);
    
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError(null);

//         if (formData.password !== formData.confirmPassword) {
//             setError("Passwords do not match.");
//             setIsLoading(false);
//             return;
//         }

//         if (!formData.role) {
//             setError("Please select a role.");
//             setIsLoading(false);
//             return;
//         }

//         try {
//             // 2. Submit the FINAL data to the new backend endpoint
//             const response = await axios.post(
//                 `${API_BASE_URL}/api/auth/complete-social-signup`, 
//                 {
//                     name: formData.name,
//                     email: formData.email,
//                     googleId: formData.googleId,
//                     role: formData.role,
//                     password: formData.password,
//                     confirmPassword: formData.confirmPassword
//                 }
//             );

//             // 3. Handle Success: Store token, update app state, and redirect
//             const { token, user } = response.data;
//             localStorage.setItem('token', token); // Store JWT token
//             onLogin(user); // Update the global app state with user data

//             // Redirect based on the user's selected role
//             navigate(user.role === "Manager" ? "/manager" : "/employee");

//         } catch (err) {
//             console.error("Final Signup Error:", err);
//             // Replace alert with setting the error state
//             setError(err.response?.data?.msg || "Failed to complete signup.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Show a minimal message if data hasn't loaded or an error occurred
//     if (error || !formData.email) {
//         return (
//             <div className="auth-wrapper">
//                 <div className="cont s--signup">
//                     <div className="form sign-up">
//                         <h2 style={{color: error ? 'red' : 'inherit'}}>{error || "Loading User Data..."}</h2>
//                         {error && <p>Please wait or return to the <Link to="/login">login page</Link>.</p>}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
    
//     // Main form rendering
//     return (
//         <div className="auth-wrapper">
//             {/* Using .cont s--signup and .form sign-up for styling consistency */}
//             <div className="cont s--signup">
//                 <div className="form sign-up">
//                     <h2>Welcome, <strong>{formData.name}</strong></h2>
//                     <p>! Please choose your role and set a secure password.</p>
                    
                    
//                     <form onSubmit={handleSubmit}>
                        
//                         {/* Read-only fields */}
//                         {/* <label>
//                             <span>Email </span>
//                             <input
//                                 type="text"
//                                 name="email"
//                                 value={formData.email}
//                                 readOnly
//                                 style={{backgroundColor: '#f0f0f0', cursor: 'default'}}
//                             />
//                         </label> */}

//                         {/* Role Selection */}
//                         <label>
//                             <span>Role</span>
//                             <select
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select Role</option>
//                                 <option value="Employee">Employee</option>
//                                 <option value="Manager">Manager</option>
//                             </select>
//                         </label>

//                         {/* Password Input */}
//                         <label>
//                             <span>Password</span>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 minLength="6"
//                             />
//                         </label>

//                         {/* Confirm Password Input */}
//                         <label>
//                             <span>Confirm Password</span>
//                             <input
//                                 type="password"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 required
//                                 minLength="6"
//                             />
//                         </label>
                        
//                         {/* Error Message */}
//                         {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

//                         {/* Submit Button */}
//                         <div className="form-buttons">
//                             <button type="submit" className="submit" disabled={isLoading}>
//                                 {isLoading ? 'Finalizing...' : 'Complete Signup'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SocialSignupComplete;


import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SocialSignupComplete = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  // Extract social data from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const encodedData = query.get('data');

    if (!encodedData) {
      setError("Missing social data. Redirecting to login.");
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    try {
      const decodedJson = atob(encodedData);
      const userData = JSON.parse(decodedJson);
      setFormData(prev => ({
        ...prev,
        ...userData,
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

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      onLogin(user);
      navigate(user.role === "Manager" ? "/manager" : "/employee");
    } catch (err) {
      console.error("Final Signup Error:", err);
      setError(err.response?.data?.msg || "Failed to complete signup.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading/Error screen
  if (error || !formData.email) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '2rem',
      }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        }}>
          <h2 style={{ color: error ? 'red' : '#1e3a8a', marginBottom: '1rem' }}>{error || "Loading User Data..."}</h2>
          {error && <p>Please wait or return to <Link to="/login">login page</Link>.</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: '#fff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: '#1e3a8a',
          padding: '1.5rem',
          color: '#fff',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          Social Signup Complete
        </div>

        {/* Form Container */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: '1rem' }}>
            Welcome, <strong>{formData.name}</strong>
          </h3>
          <p style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>
            Please choose your role and set a secure password.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Role Selection */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: '600', color: '#1e3a8a' }}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: '600', color: '#1e3a8a' }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: '600', color: '#1e3a8a' }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>

            {error && <p style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px',
                background: '#4CAF50',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              {isLoading ? 'Finalizing...' : 'Complete Signup'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
            Already have an account? <Link to="/login" style={{ color: '#1e3a8a' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialSignupComplete;
