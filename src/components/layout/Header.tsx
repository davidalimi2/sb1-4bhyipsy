import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { useAuthContext } from '../../contexts/AuthContext';

export function Header() {
  const { user } = useAuthContext();

  return (
    <header className="bg-white shadow-sm lg:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex lg:hidden">
            <button className="px-4 text-gray-500 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center ml-auto">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>

            <div className="ml-4 relative flex-shrink-0">
              <Avatar
                name={user?.email || 'User'}
                size="sm"
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}