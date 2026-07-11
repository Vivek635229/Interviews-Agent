import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { ROUTES } from '../../constants/routes';

/**
 * SettingsContent — profile management with real backend integration.
 */
const SettingsContent = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTitle(user.title || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveMessage('');
    setSaving(true);

    try {
      const response = await userService.updateProfile({ name, email, title });
      updateUser(response.data.user);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => { setShowPasswordModal(false); setPasswordSuccess(''); }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await userService.deleteAccount();
      await logout();
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-display-lg text-ink mb-2">Settings</h1>
        <p className="text-body-md text-body">Manage your profile and preferences.</p>
      </motion.div>

      {/* Profile Section */}
      <Card>
        <h2 className="font-display text-heading-md text-ink mb-6">Profile Information</h2>
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={name || 'User'} size="xl" />
            <div>
              <p className="text-body-sm-strong text-ink">{name || 'User'}</p>
              <p className="text-caption-sm text-mute">{email}</p>
            </div>
          </div>

          {saveMessage && (
            <div className={`p-3 rounded-lg text-body-sm ${saveMessage.includes('success') ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>
              {saveMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Input
            label="Job Title (optional)"
            placeholder="e.g., Frontend Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Security Section */}
      <Card>
        <h2 className="font-display text-heading-md text-ink mb-6">Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-hairline">
            <div>
              <p className="text-body-sm-strong text-ink">Password</p>
              <p className="text-caption-sm text-mute">Change your account password</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="font-display text-heading-md text-red-600 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between p-4 rounded-lg border border-red-200">
          <div>
            <p className="text-body-sm-strong text-ink">Delete Account</p>
            <p className="text-caption-sm text-mute">Permanently delete your account and all associated data.</p>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-600/10" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-canvas rounded-xl p-6 w-full max-w-[400px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-heading-md text-ink mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="p-3 rounded-lg bg-red-600/10 text-red-500 text-body-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="p-3 rounded-lg bg-green-600/10 text-green-500 text-body-sm">{passwordSuccess}</div>
              )}
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                helperText="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-canvas rounded-xl p-6 w-full max-w-[400px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/10 flex items-center justify-center">
                <i className="bi-exclamation-triangle text-2xl text-red-600" />
              </div>
              <h3 className="font-display text-heading-md text-ink mb-2">Delete Account</h3>
              <p className="text-body-sm text-body">
                This action is permanent and cannot be undone. All your data will be lost.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button fullWidth className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete Forever'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsContent;
