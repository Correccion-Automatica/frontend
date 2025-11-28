import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

export default function RequireRole({ children, allow = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Cargando…</div>;

  if (!user || (allow.length && !allow.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}