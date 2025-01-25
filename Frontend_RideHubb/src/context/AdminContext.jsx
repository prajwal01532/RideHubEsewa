import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in on component mount
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  const adminLogin = () => {
    localStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
  };

  const adminLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}; 