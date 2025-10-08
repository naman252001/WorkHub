// import React from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Add this
// import "./WelcomePage.css";
// import Footer from "../components/Footer"; 
// import { FaTasks, FaUsers, FaChartLine, FaCalendarCheck, FaClipboardList } from "react-icons/fa";

// function WelcomePage() {
//   const navigate = useNavigate(); // ✅ Hook to navigate

//   return (
//     <div className="welcome-container">
//       <div className="welcome-overlay">
//         {/* Navbar-like top section */}
//         <header className="welcome-header">
//           <div className="welcome-logo">
//             <img src="/logo/image.png" alt="Logo" />
//           </div>
//           <div className="welcome-brand">
//             <h1 className="welcome-title">
//               <strong>WorkHub</strong>
//               <span className="welcome-slogan"> – Simplify Work. Empower Teams</span>
//             </h1>
//           </div>

//           <div className="welcome-buttons">
//             <button 
//               className="btn-login"
//               onClick={() => navigate("/login")} // ✅ Go to login page
//             >
//               <strong>Login</strong>
//             </button>
//             <button 
//               className="btn-signup"
//               onClick={() => navigate("/signup")} // ✅ Go to signup page
//             >
//               <strong>Sign Up</strong>
//             </button>
//           </div>
//         </header>

//         {/* Main greeting */}
//         <section className="welcome-intro">
//           <h2><strong>Your Productivity Partner</strong></h2>
//           <p>
//             <strong>
//               WorkHub helps managers and employees collaborate efficiently.
//               Track daily tasks, review past work, and monitor performance — all
//               in one place.
//             </strong>
//           </p>
//         </section>

//         {/* First row - 3 cards */}
//         <section className="welcome-features first-row">
//           <div className="feature-card">
//             <FaTasks className="feature-icon" />
//             <h3><strong>Task Tracking</strong></h3>
//             <p><strong>Assign, manage, and complete tasks with ease and transparency.</strong></p>
//           </div>

//           <div className="feature-card">
//             <FaUsers className="feature-icon" />
//             <h3><strong>Team Collaboration</strong></h3>
//             <p><strong>Seamless communication between managers and employees.</strong></p>
//           </div>

//           <div className="feature-card">
//             <FaChartLine className="feature-icon" />
//             <h3><strong>Performance Reports</strong></h3>
//             <p><strong>Analyze productivity and track growth with detailed reports.</strong></p>
//           </div>
//         </section>

//         {/* Second row - 2 centered cards */}
//         <section className="welcome-features second-row">
//           <div className="feature-card">
//             <FaCalendarCheck className="feature-icon" />
//             <h3><strong>Attendance Tracking</strong></h3>
//             <p><strong>Monitor daily attendance and maintain accurate work records.</strong></p>
//           </div>

//           <div className="feature-card">
//             <FaClipboardList className="feature-icon" />
//             <h3><strong>Leave Apply & Approvals</strong></h3>
//             <p><strong>Apply for leaves and manage approvals quickly and efficiently.</strong></p>
//           </div>
//         </section>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default WelcomePage;


import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaUsers, FaChartLine, FaCalendarCheck, FaClipboardList } from "react-icons/fa";
import Footer from "../components/Footer";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      {/* Overlay */}
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <style>{`
          .btn-login:hover {
            background-color: rgba(70,130,180,1) !important;
            color: white !important;
          }
          .btn-signup:hover {
            background-color: rgba(176,196,222,1) !important;
            color: black !important;
          }
          .feature-card:hover {
            background-color: rgba(255,255,255,0.2) !important;
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.3);
          }
        `}</style>

        {/* Navbar */}
        <header
          className="d-flex align-items-center justify-content-between px-4 py-3 sticky-top flex-wrap"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", zIndex: 100 }}
        >
          {/* Left: Logo */}
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <img src="/logo/image3.png" alt="Logo" style={{ height: "50px" }} className="me-3" />
          </div>

          {/* Center: Title + Slogan */}
          <div className="text-center mx-auto">
            <h1 className="h4 m-0">WorkHub</h1>
            <span style={{ fontSize: "14px", color: "#fffcfc" }}>Simplify Work. Empower Teams</span>
          </div>

          {/* Right: Buttons */}
          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn btn-login px-3"
              style={{ backgroundColor: "rgba(70,130,180,0.9)", color: "white", borderRadius: "6px", fontWeight: "bold" }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-signup px-3"
              style={{ backgroundColor: "rgba(176,196,222,0.9)", color: "black", borderRadius: "6px", fontWeight: "bold" }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </header>

        {/* Intro Section */}
        <section className="text-center my-5 mx-auto" style={{ maxWidth: "700px" }}>
          <h2 className="mb-3" style={{ fontSize: "32px", fontWeight: "bold", color: "#f5f5f5" }}>
            Your Productivity Partner
          </h2>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#e0e0e0" }}>
            WorkHub helps managers and employees collaborate efficiently.
            Track daily tasks, review past work, and monitor performance — all in one place.
          </p>
        </section>

        {/* First Row - 3 Cards */}
        <section className="container py-4">
          <div className="row g-4 text-center">
            {[{
              icon: <FaTasks size={50} className="mb-3 text-info" />,
              title: "Task Tracking",
              desc: "Assign, manage, and complete tasks with ease and transparency."
            },{
              icon: <FaUsers size={50} className="mb-3 text-info" />,
              title: "Team Collaboration",
              desc: "Seamless communication between managers and employees."
            },{
              icon: <FaChartLine size={50} className="mb-3 text-info" />,
              title: "Performance Reports",
              desc: "Analyze productivity and track growth with detailed reports."
            }].map((item, idx) => (
              <div className="col-12 col-md-4" key={idx}>
                <div
                  className="feature-card d-flex flex-column align-items-center justify-content-center p-4 w-100"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "15px",
                    minHeight: "280px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease-in-out",
                    textAlign: "center"
                  }}
                >
                  {item.icon}
                  <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "16px", fontWeight: "bold", color: "#dcdcdc" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Second Row - 2 Cards Centered */}
        <section className="container py-4">
          <div className="row justify-content-center g-4">
            {[{
              icon: <FaCalendarCheck size={50} className="mb-3 text-info" />,
              title: "Attendance Tracking",
              desc: "Monitor daily attendance and maintain accurate work records."
            },{
              icon: <FaClipboardList size={50} className="mb-3 text-info" />,
              title: "Leave Apply & Approvals",
              desc: "Apply for leaves and manage approvals quickly and efficiently."
            }].map((item, idx) => (
              <div className="col-12 col-md-6 col-lg-5" key={idx}>
                <div
                  className="feature-card d-flex flex-column align-items-center justify-content-center p-4 w-100"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: "15px",
                    minHeight: "280px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease-in-out",
                    textAlign: "center"
                  }}
                >
                  {item.icon}
                  <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "16px", fontWeight: "bold", color: "#dcdcdc" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto" style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "15px", textAlign: "center", color: "#fff" }}>
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default WelcomePage;
