// import React, { useState, useEffect } from "react";
// import "./Header.css";

// const Header = ({ employeeName, role }) => {
//   const today = new Date();
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const dateString = today.toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const timeString = currentTime.toLocaleTimeString("en-US");

//   return (
//     <header className="dashboard-header">
//       <div className="center-section">
//         <h2>{employeeName}</h2>
//         <p>{role}</p>
//       </div>
//       <div className="date-section">
//         <p>{dateString}</p>
//         <p className="live-time">{timeString}</p>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ employeeName, role }) => {
  const today = new Date();
  const [currentTime, setCurrentTime] = useState(new Date());

  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-US");

  return (
    <header
      className="d-flex justify-content-center align-items-center position-relative flex-wrap text-center"
      style={{
        backgroundColor: "#b4defdb6",
        padding: "20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      {/* Center section (Employee Name + Role) */}
      <div>
        <h2
          className="mb-1"
          style={{
            fontWeight: "bold",
            fontSize: "clamp(18px, 3vw, 28px)", // responsive font size
          }}
        >
          {employeeName}
        </h2>
        <p
          style={{
            fontSize: "clamp(14px, 2vw, 18px)", // responsive font size
            margin: 0,
          }}
        >
          {role}
        </p>
      </div>

      {/* Right section (Date + Time) */}
      <div
        className="position-absolute text-end d-none d-md-block"
        style={{ right: "20px", color: "#333" }}
      >
        <p style={{ margin: 0, fontSize: "16px" }}>{dateString}</p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: 500,
            marginTop: "5px",
            marginBottom: 0,
            color: "#007bff",
          }}
        >
          {timeString}
        </p>
      </div>

      {/* For small screens, put date/time below center */}
      <div className="d-block d-md-none w-100 mt-2">
        <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>{dateString}</p>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 500,
            marginTop: "3px",
            marginBottom: 0,
            color: "#007bff",
          }}
        >
          {timeString}
        </p>
      </div>
    </header>
  );
};

export default Header;
