// import { BrowserRouter } from "react-router-dom";
// import ReactDOM from "react-dom";
// import React from "react";
// import App from "./App";
// import "./index.css";

// // Render React app
// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById("root"),
//   () => {
//     // Callback runs after React has mounted
//     const splash = document.getElementById("splash-screen");
//     if (splash) {
//       splash.style.opacity = "0";
//       setTimeout(() => splash.remove(), 500); // fade-out before removing
//     }
//   }
// );


import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Render React app
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root"),
  () => {
    // Callback runs after React has mounted
    const splash = document.getElementById("splash-screen");
    if (splash) {
      splash.style.opacity = "0";
      setTimeout(() => splash.remove(), 500); // fade-out before removing
    }
  }
);

