import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { hasRole } from '../../utils/roleConfig';

/**
 * Role-Protected Route Component
 * Redirects users without proper role access to unauthorized page or dashboard
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.redirectTo - Where to redirect unauthorized users (default: /dashboard)
 * @param {React.ReactNode} props.fallback - Custom fallback component for unauthorized access
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard',
  fallback = null 
}) => {
  const { user, token } = useAuthStore();

  // If not logged in, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = hasRole(user.role, allowedRoles);

  if (!hasRequiredRole) {
    // If fallback provided, show it
    if (fallback) {
      return fallback;
    }

    // Otherwise redirect
    return <Navigate to={redirectTo} replace />;
  }

  // User has proper role, render children
  return children;
};

export default RoleProtectedRoute;

