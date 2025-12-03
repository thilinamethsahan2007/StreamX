'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted user
        const storedUser = localStorage.getItem('streamx_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signIn = async (username: string, password: string) => {
        // Check if user exists in 'users' table with matching password
        const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) {
            throw new Error('Invalid username or password');
        }

        const newUser = { username: data.username };
        setUser(newUser);
        localStorage.setItem('streamx_user', JSON.stringify(newUser));
    };

    const signUp = async (username: string, password: string) => {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Insert new user
        const { error } = await supabase
            .from('users')
            .insert({ username, password });

        if (error) {
            throw new Error(error.message);
        }

        const newUser = { username };
        setUser(newUser);
        localStorage.setItem('streamx_user', JSON.stringify(newUser));
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('streamx_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
