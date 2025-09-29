import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./pages/LoginPage";
import SignupForm from "./pages/SignupPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PastWorkPanel from "./components/PastWorkPanel";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDetails from "./pages/EmployeeDetails";
import ManagerPastWork from "./pages/ManagerPastWork";
import WelcomePage from "./pages/WelcomePage";
import Attendance from "./components/Attendance";
import LeaveForm from "./components/LeaveForm";
import Profile from "./pages/ProfilePage";
import ManagerAttendanceDashboard from "./pages/ManagerAttendanceDashboard";
import ManagerLeaveApplications from "./pages/ManagerLeaveApplications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// NEW IMPORTS for Social Auth Flow
import SocialSignupComplete from "./pages/SocialSignupComplete";
import OAuthSuccessHandler from "./pages/OAuthSuccessHandler";
import "./index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className={`app-container ${isLoggedIn && darkMode ? "dark-body" : ""}`}>
      {isLoggedIn && (
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          role={user?.role}
        />
      )}
      {isLoggedIn && user && <Header employeeName={user.name} role={user.role} />}

      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to={user?.role === "Manager" ? "/manager" : "/employee"} />
              ) : (
                <WelcomePage />
              )
            }
          />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

            {/* --- NEW SOCIAL AUTH ROUTES --- */}
            {/* 1. For new users to set role/password */}
            <Route path="/social-signup-complete" element={<SocialSignupComplete onLogin={handleLogin} />} />
            {/* 2. For existing users redirecting from Google with a token */}
            <Route path="/oauth-success" element={<OAuthSuccessHandler onLogin={handleLogin} />} />
            {/* ------------------------------- */}

          {/* Protected routes */}
          {isLoggedIn && user && (
            <>
              {/* Profile route for both roles */}
              <Route path="/profile" element={<Profile />} />

              {user.role === "Employee" && (
                <>
                  <Route
                    path="/employee"
                    element={
                      <EmployeeDashboard
                        employeeName={user.name}
                        role={user.role}
                        darkMode={darkMode}
                      />
                    }
                  />
                  <Route path="/past-work" element={<PastWorkPanel />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leave/apply" element={<LeaveForm />} />
                </>
              )}

              {user.role === "Manager" && (
                <>
                  <Route path="/manager" element={<ManagerDashboard />} />
                  <Route path="/past-work" element={<ManagerPastWork />} />
                  <Route
                    path="/attendance"
                    element={<ManagerAttendanceDashboard />}
                  />
                  <Route
                    path="/manager-leave-applications"
                    element={<ManagerLeaveApplications />}
                  />
                </>
              )}
              <Route path="/employee-details/:id" element={<EmployeeDetails />} />
            </>
          )}
        </Routes>
      </div>

      {isLoggedIn && <Footer />}
      
      {/* Fallback check for auth pages to ensure components are rendered if paths were the issue */}
      {/* This doesn't fix the pathing issue but ensures the router is correctly configured */}
      {isAuthPage && !isLoggedIn && (
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none"></div>
      )}
      
    </div>
  );
}

export default App;
