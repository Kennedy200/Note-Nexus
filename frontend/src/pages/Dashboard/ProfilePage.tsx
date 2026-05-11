import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit, Save, X, Lock, Loader2, BookOpen } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const ProfilePage: React.FC = () => {
  const { showToast } = useToast();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('notenexus_user') || '{}'));
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    phone_number: user.phone_number || '',
    bio: user.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/profile/${user.id}`);
      const data = await res.json();
      setUser(data);
      setFormData({
        full_name: data.full_name,
        phone_number: data.phone_number || '',
        bio: data.bio || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('bio', formData.bio);

      const res = await fetch(`http://localhost:8000/api/profile/${user.id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Profile updated!', 'Your changes have been saved');
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('notenexus_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
      } else {
        showToast('error', 'Update failed', data.detail || 'Please try again');
      }
    } catch (err) {
      showToast('error', 'Connection error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('error', 'Passwords do not match', 'Please confirm your new password');
      return;
    }

    if (passwordData.new_password.length < 6) {
      showToast('error', 'Password too short', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('current_password', passwordData.current_password);
      formDataToSend.append('new_password', passwordData.new_password);

      const res = await fetch(`http://localhost:8000/api/profile/${user.id}/password`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Password changed!', 'Your password has been updated');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setChangingPassword(false);
      } else {
        showToast('error', 'Password change failed', data.detail || 'Please check your current password');
      }
    } catch (err) {
      showToast('error', 'Connection error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">👤 My Profile</h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-1">{user.full_name}</h3>
              <p className="text-gray-500 font-bold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-sm text-gray-400 font-bold mt-1">
                Member since {new Date(user.created_at).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm uppercase hover:bg-blue-700 transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Phone Number</label>
              <input
                type="tel"
                maxLength={11}
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value.replace(/\D/g, '') })}
                placeholder="08012345678"
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-sm uppercase hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    full_name: user.full_name,
                    phone_number: user.phone_number || '',
                    bio: user.bio || ''
                  });
                }}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
              <Phone className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-xs font-black text-gray-500 uppercase">Phone Number</p>
                <p className="text-lg font-bold text-gray-900">{user.phone_number || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <BookOpen className="w-6 h-6 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-black text-gray-500 uppercase mb-2">Bio</p>
                <p className="text-base font-medium text-gray-700 leading-relaxed">
                  {user.bio || 'No bio added yet. Tell others about yourself!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 uppercase italic">🔒 Security</h3>
            <p className="text-gray-500 font-bold text-sm">Change your password</p>
          </div>

          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-sm uppercase hover:bg-blue-600 transition-all"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          )}
        </div>

        {changingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl font-black text-sm uppercase hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Update Password
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                }}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm uppercase hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;