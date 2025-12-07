// app/admin/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { Settings, Key, Save, Check, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handlePasswordChange = () => {
        // For demo purposes - in production this would update the actual password
        if (currentPassword !== 'admin123') {
            setStatus('error');
            setMessage('Current password is incorrect');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus('error');
            setMessage('New passwords do not match');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        if (newPassword.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters');
            setTimeout(() => setStatus('idle'), 3000);
            return;
        }

        // In a real app, this would update the password
        setStatus('success');
        setMessage('Password updated! (Note: Demo only - password still admin123)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your admin panel settings</p>
            </div>

            {/* Password Section */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Change Password</h2>
                        <p className="text-gray-400 text-sm">Update your admin password</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {status === 'success' && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            {message}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {message}
                        </div>
                    )}

                    <button
                        onClick={handlePasswordChange}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Update Password
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">About Admin Panel</h2>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-gray-400">
                    <p>
                        This admin panel allows you to manage all content for your 3D building website.
                        Changes are saved to your browser&apos;s local storage.
                    </p>
                    <p>
                        <strong className="text-white">Note:</strong> Data is stored locally in your browser.
                        Use the Export/Import feature to backup your data or transfer it to another device.
                    </p>
                </div>
            </div>
        </div>
    );
}
