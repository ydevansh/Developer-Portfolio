import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUpload } from 'react-icons/fa';
import Card from '../../components/admin/Card';
import Button from '../../components/admin/Button';

export default function Settings() {
  const [formData, setFormData] = useState({
    adminEmail: 'yaduvanshidevansh3336@gmail.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileName: 'Devansh Yadav',
    profileBio: 'Full-stack Developer | Student',
    profilePhone: '+91 6388525760',
  });

  const [passwordChanged, setPasswordChanged] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (
      formData.newPassword &&
      formData.newPassword === formData.confirmPassword
    ) {
      setPasswordChanged(true);
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setTimeout(() => setPasswordChanged(false), 3000);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 3000);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Resume uploaded:', file.name);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Success Messages */}
      {passwordChanged && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm"
        >
          ✓ Password changed successfully!
        </motion.div>
      )}

      {profileUpdated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm"
        >
          ✓ Profile updated successfully!
        </motion.div>
      )}

      {/* Profile Settings */}
      <Card>
        <h2 className="text-xl font-bold mb-6">Profile Information</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="profileName"
              value={formData.profileName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="profileBio"
              value={formData.profileBio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="profilePhone"
              value={formData.profilePhone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <Button icon={FaSave} variant="primary" type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </Card>

      {/* Resume Upload */}
      <Card>
        <h2 className="text-xl font-bold mb-6">Resume</h2>

        <div className="border-2 border-dashed border-primary-500/30 rounded-lg p-8 text-center hover:border-primary-500/50 transition-colors cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer block">
            <div className="p-3 bg-primary-500/20 rounded-lg inline-block mb-3">
              <FaUpload size={24} className="text-primary-500" />
            </div>
            <p className="text-gray-300 font-medium mb-1">Upload Resume</p>
            <p className="text-gray-500 text-sm">PDF, DOC, or DOCX (Max 5MB)</p>
          </label>
        </div>

        {/* Current Resume */}
        <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <p className="text-sm text-gray-400">Current Resume</p>
          <p className="text-white font-medium mt-2">Devansh_Yadav_Resume.pdf</p>
          <p className="text-xs text-gray-500 mt-1">Uploaded on 2024-01-10</p>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <h2 className="text-xl font-bold mb-6">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {formData.newPassword &&
            formData.confirmPassword &&
            formData.newPassword !== formData.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                Passwords do not match!
              </motion.p>
            )}

          <Button variant="primary" type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5">
        <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>

        <button className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-medium transition-all">
          Delete Account
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Warning: This action is irreversible. All your data will be permanently deleted.
        </p>
      </Card>
    </motion.div>
  );
}
