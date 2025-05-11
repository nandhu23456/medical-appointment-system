import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Calendar, FileText, CreditCard, LogOut, Menu, X, User, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isPatient = user?.role === 'patient';
  
  const navigationItems = isPatient 
    ? [
        { name: 'Dashboard', icon: <User size={20} />, path: '/patient' },
        { name: 'Book Appointment', icon: <Calendar size={20} />, path: '/patient/appointments/book' },
        { name: 'Medical Records', icon: <FileText size={20} />, path: '/patient/medical-records' }
      ]
    : [
        { name: 'Dashboard', icon: <User size={20} />, path: '/doctor' },
        { name: 'Appointments', icon: <Calendar size={20} />, path: '/doctor/appointments' }
      ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">HealthConnect</span>
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {isPatient ? (
                    <User size={16} className="mr-1" />
                  ) : (
                    <Stethoscope size={16} className="mr-1" />
                  )}
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for desktop */}
        <aside className="hidden sm:flex sm:flex-col sm:w-64 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                    ${location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <span className={`
                    mr-3 
                    ${location.pathname === item.path
                      ? 'text-blue-500'
                      : 'text-gray-500 group-hover:text-gray-500'}
                  `}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full flex items-center"
            >
              <div className="flex items-center">
                <LogOut size={20} className="text-gray-500 group-hover:text-gray-700 mr-3" />
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Logout
                </div>
              </div>
            </button>
          </div>
        </aside>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute inset-0 z-50 bg-white">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-semibold text-gray-900">HealthConnect</span>
                </div>
                <div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <nav className="grid gap-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                        group flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors
                        ${location.pathname === item.path
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`
                        mr-3 
                        ${location.pathname === item.path
                          ? 'text-blue-500'
                          : 'text-gray-500 group-hover:text-gray-500'}
                      `}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            
            <div className="border-t border-gray-200 py-6 px-5">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {isPatient ? <User size={16} className="mr-1" /> : <Stethoscope size={16} className="mr-1" />}
                  {user?.name}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md w-full"
              >
                <LogOut size={20} className="text-gray-500 group-hover:text-gray-700 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;