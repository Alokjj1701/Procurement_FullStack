import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {
  // Optionally define allowed roles here if needed for more granular control
  // allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  // Optionally add role checking here if allowedRoles is defined
  // if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // user is authenticated and authorized (if role checking is enabled)
  return <Outlet />;
};

export default ProtectedRoute; 