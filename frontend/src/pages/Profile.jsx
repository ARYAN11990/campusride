import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Edit profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Photo state
  const [photoLoading, setPhotoLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Update Profile ───
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);
    try {
      const { data } = await API.put('/profile', profileData);
      updateUser({ name: data.name, email: data.email, phone: data.phone });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Change Password ───
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setPasswordLoading(true);
    try {
      const { data } = await API.put('/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMsg({ type: 'success', text: data.message });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ─── Upload Photo ───
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    setPhotoLoading(true);
    try {
      const { data } = await API.put('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ profilePhoto: data.profilePhoto });
    } catch (err) {
      alert(err.response?.data?.message || 'Photo upload failed');
    } finally {
      setPhotoLoading(false);
    }
  };

  // ─── Delete Account ───
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await API.delete('/profile');
      logout();
      navigate('/register');
    } catch (err) {
      alert(err.response?.data?.message || 'Account deletion failed');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const avatarStyle = getAvatarColor(user?.name);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      {/* ─── Avatar & Photo Section ─── */}
      <div className="glass rounded-2xl p-8 mb-6 flex flex-col items-center">
        <div className="relative group mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <button
            onClick={handlePhotoClick}
            disabled={photoLoading}
            className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-500/50 transition-all cursor-pointer"
          >
            {user?.profilePhoto ? (
              <img
                src={`http://localhost:5000/${user.profilePhoto}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-gray-800 text-4xl font-bold"
                style={avatarStyle}
              >
                {user?.name?.charAt(0) || '?'}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {photoLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span className="mt-2 px-3 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-600 capitalize">
          {user?.role}
        </span>
      </div>

      {/* ─── Edit Profile Section ─── */}
      <div className="glass rounded-2xl p-8 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Edit Profile
        </h3>

        <StatusMessage msg={profileMsg} />

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <InputField
            label="Name"
            value={profileData.name}
            onChange={(v) => setProfileData({ ...profileData, name: v })}
          />
          <InputField
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(v) => setProfileData({ ...profileData, email: v })}
          />
          <InputField
            label="Phone"
            type="tel"
            value={profileData.phone}
            onChange={(v) => setProfileData({ ...profileData, phone: v })}
            required={false}
          />
          <button
            type="submit"
            disabled={profileLoading}
            className="w-full py-3 text-white font-semibold btn-transition disabled:opacity-50"
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* ─── Change Password Section ─── */}
      <div className="glass rounded-2xl p-8 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Change Password
        </h3>

        <StatusMessage msg={passwordMsg} />

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(v) => setPasswordData({ ...passwordData, currentPassword: v })}
          />
          <InputField
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })}
            minLength={6}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })}
            minLength={6}
          />
          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full py-3 text-white font-semibold btn-transition disabled:opacity-50"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* ─── Danger Zone ─── */}
      <div className="glass rounded-2xl p-8 border border-red-500/20">
        <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Danger Zone
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back. All your rides, bookings, and messages will be permanently removed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 border border-red-500/20 transition-colors"
        >
          Delete My Account
        </button>
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative glass rounded-2xl p-8 max-w-md w-full border border-red-500/20 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Account?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will permanently delete your account, all your rides, bookings, and messages. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-gray-800 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-gray-800 font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Helper Components ───

const InputField = ({ label, type = 'text', value, onChange, required = true, minLength }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-slate-500 focus:border-blue-500"
      required={required}
      minLength={minLength}
    />
  </div>
);

const StatusMessage = ({ msg }) => {
  if (!msg.text) return null;
  return (
    <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
      msg.type === 'success'
        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
        : 'bg-red-500/10 border border-red-500/20 text-red-400'
    }`}>
      {msg.text}
    </div>
  );
};

export default Profile;
