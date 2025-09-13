import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut, Terminal } from 'lucide-react';
import { useNameStore } from '../store/nameStore';
import MaintenanceMode from './MaintenanceMode';
import MaintenanceWarning from './MaintenanceWarning';
import { useMaintenanceCheck } from '../hooks/useMaintenance';

export default function Layout() {
  const { name, setName } = useNameStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { inMaintenance } = useMaintenanceCheck();

  const isHackPage = location.pathname === '/hack' || location.pathname === '/hack-transition' || location.pathname === '/hack-main';
  const isAdminPage = location.pathname === '/admin-auth' || location.pathname === '/admin-dashboard';

  const handleSignOut = () => {
    setName('');
    navigate('/name');
  };

  const handleMaintenanceEnd = () => {
    // The hook will automatically update the maintenance status
    // No need to manually set state here
  };

  // Show maintenance mode if in maintenance window
  if (inMaintenance) {
    return <MaintenanceMode onMaintenanceEnd={handleMaintenanceEnd} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/home" className="flex items-center space-x-2">
                {isAdminPage ? (
                  <>
                    <Terminal className="h-6 w-6 text-red-500" />
                    <span className="font-semibold text-xl text-red-600">Admin Panel</span>
                  </>
                ) : isHackPage ? (
                  <>
                    <Terminal className="h-6 w-6 text-green-500" />
                    <span className="font-semibold text-xl text-green-600">Code Transfer</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                    <span className="font-semibold text-xl">ExoChat</span>
                  </>
                )}
              </Link>
            </div>
            <div className="flex items-center">
              {name ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Hi, {name}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Leave</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/name"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Enter Name
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Maintenance Warning */}
      <MaintenanceWarning />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}