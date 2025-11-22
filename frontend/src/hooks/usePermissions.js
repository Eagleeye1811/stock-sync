import { useAuthStore } from '../stores/authStore';
import { hasPermission, hasRole } from '../utils/roleConfig';

/**
 * Custom hook for checking user permissions
 * Makes it easy to conditionally render UI based on user role
 */
export const usePermissions = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission key from PERMISSIONS
   * @returns {boolean}
   */
  const can = (permission) => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of role strings
   * @returns {boolean}
   */
  const isRole = (roles) => {
    if (!userRole) return false;
    return hasRole(userRole, Array.isArray(roles) ? roles : [roles]);
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => userRole === 'ADMIN';

  /**
   * Check if user is manager
   * @returns {boolean}
   */
  const isManager = () => userRole === 'MANAGER';

  /**
   * Check if user is staff
   * @returns {boolean}
   */
  const isStaff = () => userRole === 'STAFF';

  /**
   * Check if user can manage (admin or manager)
   * @returns {boolean}
   */
  const canManage = () => userRole === 'ADMIN' || userRole === 'MANAGER';

  return {
    can,
    isRole,
    isAdmin,
    isManager,
    isStaff,
    canManage,
    userRole,
  };
};

