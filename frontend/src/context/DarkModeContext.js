// src/context/DarkModeContext.js
import React, { createContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-body', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
