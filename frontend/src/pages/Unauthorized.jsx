import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { getRoleDisplayName } from '../utils/roleConfig';

/**
 * Unauthorized Access Page
 * Shown when user tries to access a route they don't have permission for
 */
const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert size={48} className="text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-2">
          You don't have permission to access this page.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-8">
            Your role: <span className="font-semibold">{getRoleDisplayName(user.role)}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home size={20} className="mr-2" />
            Go to Dashboard
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe you should have access to this page, please contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;

