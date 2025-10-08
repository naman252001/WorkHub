// import React from "react";
// import "./Footer.css"; // We will create this CSS file

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <p>© 2025 This website is created by <strong>Naman Pandey</strong></p>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#b4defdb6",
    color: "#333",
    textAlign: "center",
    padding: "15px 0",
    borderTop: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
    // position: "sticky", // sticky-scroll behavior
    bottom: 0,
    left: 0,
    zIndex: 1000, // ensures it stays above other content
  };

  const nameStyle = {
    color: "#2e7d32", // green for your name
    fontWeight: "bold",
  };

  return (
    <footer style={footerStyle}>
      <p style={{ margin: 0 }}>
        © 2025 This website is created by <span style={nameStyle}>Naman Pandey</span>
      </p>
    </footer>
  );
};

export default Footer;
