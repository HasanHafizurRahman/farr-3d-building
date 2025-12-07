// app/admin/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAdminAuth, logoutAdmin } from '@/lib/adminData';
import { Building2, Layers, Settings, LogOut, Home, Menu, X, Database } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const auth = checkAdminAuth();
        setIsAuthenticated(auth);

        if (!auth && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [pathname, router]);

    const handleLogout = () => {
        logoutAdmin();
        router.push('/admin/login');
    };

    const navItems = [
        { href: '/admin', icon: Home, label: 'Dashboard' },
        { href: '/admin/buildings', icon: Building2, label: 'Buildings' },
        { href: '/admin/floors', icon: Layers, label: 'Floors' },
        { href: '/admin/data', icon: Database, label: 'Export/Import' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    // Show loading state while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    // Show login page without layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-gray-950 border-r border-gray-800
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-800">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                                FB
                            </div>
                            <div>
                                <div className="font-bold text-white">Admin Panel</div>
                                <div className="text-xs text-gray-500">Farr Builders</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                                        ${isActive
                                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-gray-950/50 border-b border-gray-800 flex items-center px-4 lg:px-6 sticky top-0 z-30 backdrop-blur-xl">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors mr-4"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <Link
                        href="/"
                        className="text-sm text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        View Site
                    </Link>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
