// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';

const AUTH_TOKEN_KEY = 'admin_auth_token';
const AUTH_USER_KEY = 'admin_auth_user';

interface User {
    id: string;
    username: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    verifyAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                // Invalid stored user, clear it
                localStorage.removeItem(AUTH_USER_KEY);
            }
        }

        // Verify the token
        if (storedToken) {
            verifyAuth().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifyAuth = useCallback(async (): Promise<boolean> => {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

        if (!storedToken) {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            return false;
        }

        try {
            const response = await api.verifyToken(storedToken);

            if (response.valid && response.user) {
                setIsAuthenticated(true);
                setUser({
                    id: response.user._id,
                    username: response.user.username
                });
                setToken(storedToken);
                return true;
            } else {
                // Token is invalid, clear it
                localStorage.removeItem(AUTH_TOKEN_KEY);
                localStorage.removeItem(AUTH_USER_KEY);
                setIsAuthenticated(false);
                setUser(null);
                setToken(null);
                return false;
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            // On error, keep current state but don't authenticate
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        const response = await api.login(username, password);

        // Store token and user
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
    };

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                token,
                login,
                logout,
                verifyAuth
            }}
        >
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

export default AuthContext;
