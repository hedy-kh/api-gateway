import React from 'react'
import { useAuth } from './useAuth'
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (!auth?.user) return <Navigate to='/login' replace />;
  return children;
};

export const Role = ({ children, role }) => {
  const { auth } = useAuth();
  if (!auth?.user || auth.user.role !== role) {
    return <Navigate to='/Unauthorized' replace />;
  }
  return children;
};
