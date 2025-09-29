import React, { useState, useEffect } from "react";
import "./Header.css";

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
    <header className="dashboard-header">
      <div className="center-section">
        <h2>{employeeName}</h2>
        <p>{role}</p>
      </div>
      <div className="date-section">
        <p>{dateString}</p>
        <p className="live-time">{timeString}</p>
      </div>
    </header>
  );
};

export default Header;
