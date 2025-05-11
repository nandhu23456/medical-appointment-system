import React from 'react';
import { Outlet } from 'react-router-dom';
import { Heart } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="w-full py-4 px-6 flex justify-center">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900">HealthConnect</span>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-600">
        <p>© 2025 HealthConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;