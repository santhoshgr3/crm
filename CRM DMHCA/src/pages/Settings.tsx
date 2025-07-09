import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Sun, Moon, KeyRound, UserPlus } from 'lucide-react';
import { UserRole, User } from '../types';

const Settings: React.FC = () => {
  const { state, dbOperations, theme, setTheme, changePassword } = useCRM();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: get users below current user's role
  const roleHierarchy: UserRole[] = [
    'senior_manager',
    'manager',
    'floor_manager',
    'team_leader',
    'counselor',
  ];
  const currentUser = state.currentUser;
  const currentRoleIdx = roleHierarchy.indexOf(currentUser.role);
  const usersBelow = state.users.filter(
    (u) => roleHierarchy.indexOf(u.role) > currentRoleIdx
  );

  // Reset password for another user (admin action)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);
    try {
      await dbOperations.updateUser(selectedUserId, { password: newUserPassword });
      setResetSuccess('Password reset successfully.');
      setSelectedUserId('');
      setNewUserPassword('');
    } catch (err: any) {
      setResetError(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {theme === 'dark' ? <Moon className="text-blue-600" /> : <Sun className="text-yellow-500" />}
          <div>
            <h3 className="font-semibold text-lg mb-1">Theme</h3>
            <p className="text-gray-500 text-sm">Switch between light and dark mode</p>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={handleThemeToggle}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound className="text-blue-600" />
          <h3 className="font-semibold text-lg">Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && <div className="text-red-500 font-medium">{passwordError}</div>}
          {passwordSuccess && <div className="text-green-600 font-medium">{passwordSuccess}</div>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="text-blue-600" />
          <h3 className="font-semibold text-lg">Reset User Password</h3>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select user</option>
            {usersBelow.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={newUserPassword}
            onChange={e => setNewUserPassword(e.target.value)}
            required
          />
          {resetError && <div className="text-red-500 font-medium">{resetError}</div>}
          {resetSuccess && <div className="text-green-600 font-medium">{resetSuccess}</div>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
            disabled={resetLoading}
          >
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
