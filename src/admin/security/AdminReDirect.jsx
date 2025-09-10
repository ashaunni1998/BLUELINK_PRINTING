import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import React from 'react';

const AdminRedirect = ({ children }) => {
  const adminData = useSelector((state) => state.admin);

  // If admin is already logged in, redirect to dashboard
  if (adminData) {
    return <Navigate to="/admin/" replace />;
  }

  // If not logged in, allow the children (e.g. login page)
  return <>{children}</>;
};

export default AdminRedirect;
