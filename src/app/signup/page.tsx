'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signUp(username, password);
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 bg-[url('/hero.jpg')] bg-cover bg-blend-overlay">
            <div className="w-full max-w-md p-8 bg-black/75 rounded-lg backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-white mb-8">Sign Up</h1>

                {error && (
                    <div className="bg-[#e50914]/20 border border-[#e50914] text-white p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 bg-[#e50914] text-white font-bold rounded hover:bg-[#c11119] transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4 text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white hover:underline">
                        Sign in now
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
