import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute; 