import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import LanguageSelector from '../LanguageSelector';
import toast from 'react-hot-toast';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { t } = useTranslation();
  const { state } = useCRM();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = async () => {
    try {
      // Implement your logout logic here, e.g., REST API call or context-based logout
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Reminder badge between search and language selector */}
          <div className="flex items-center mx-4">
            {state.leads && state.leads.filter(l => l.followUpDate).length > 0 && (
              <div className="flex items-center bg-yellow-100 border border-yellow-400 text-yellow-800 rounded px-3 py-1 text-xs font-semibold shadow-sm">
                <span className="mr-2">⏰</span>
                {state.leads.filter(l => l.followUpDate).length} lead(s) with follow-up reminder
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 border-l border-gray-200 pl-4"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{state.currentUser.name}</p>
                  <p className="text-gray-500 capitalize">{state.currentUser.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}