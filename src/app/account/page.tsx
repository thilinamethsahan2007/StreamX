'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import { Loader2, AlertTriangle, Check, Lock, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Change Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Delete Account State
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setIsLoading(false);
            return;
        }

        try {
            // Verify old password
            const { data: userData, error: verifyError } = await supabase
                .from('users')
                .select('password')
                .eq('username', user.username)
                .eq('password', oldPassword)
                .single();

            if (verifyError || !userData) {
                throw new Error('Incorrect old password');
            }

            // Update password
            const { error: updateError } = await supabase
                .from('users')
                .update({ password: newPassword })
                .eq('username', user.username);

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Password updated successfully' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setMessage(null);
        setIsLoading(true);

        try {
            // Verify password
            const { data: userData, error: verifyError } = await supabase
                .from('users')
                .select('password')
                .eq('username', user.username)
                .eq('password', deletePassword)
                .single();

            if (verifyError || !userData) {
                throw new Error('Incorrect password');
            }

            // Delete user (Cascade will handle related data)
            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('username', user.username);

            if (deleteError) throw deleteError;

            // Sign out and redirect
            signOut();
            router.push('/');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete account' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Navbar />

            <div className="container mx-auto px-4 pt-28 pb-12 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 tracking-tight">Settings</h1>

                <div className="glass rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.username}</h2>
                            <p className="text-gray-400">StreamX Member</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    {/* Change Password Section */}
                    <div className="mb-10">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-200">
                            <Lock className="w-5 h-5 text-blue-500" /> Security
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/5">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full md:w-auto justify-center"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-8 border-t border-white/10">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-500">
                            <Trash2 className="w-5 h-5" /> Danger Zone
                        </h3>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full md:w-auto border border-red-500/30 text-red-500 hover:bg-red-500/10 font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 animate-in fade-in slide-in-from-top-2">
                                <p className="text-red-200 mb-4 text-sm font-medium">
                                    Are you sure? This action cannot be undone. All your watch history and list data will be permanently deleted.
                                </p>
                                <div className="space-y-4">
                                    <input
                                        type="password"
                                        placeholder="Enter your password to confirm"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full bg-black/20 border border-red-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isLoading || !deletePassword}
                                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors disabled:opacity-50 flex-1"
                                        >
                                            {isLoading ? 'Deleting...' : 'Confirm Delete'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeletePassword('');
                                            }}
                                            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
