// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getAdminBuildingsData, BuildingData } from '@/lib/adminData';
import { Building2, Layers, MapPin, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [buildings, setBuildings] = useState<BuildingData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setBuildings(getAdminBuildingsData());
        setLoading(false);
    }, []);

    const totalFloors = buildings.reduce((acc, b) => acc + b.floors.length, 0);
    const totalFeatures = buildings.reduce((acc, b) => acc + b.features.length, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Manage your building content and settings</p>
                </div>
                <Link
                    href="/admin/buildings"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                >
                    <Sparkles className="w-5 h-5" />
                    Manage Content
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{buildings.length}</div>
                            <div className="text-sm text-gray-400">Buildings</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Layers className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{totalFloors}</div>
                            <div className="text-sm text-gray-400">Total Floors</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{buildings.length}</div>
                            <div className="text-sm text-gray-400">Locations</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{totalFeatures}</div>
                            <div className="text-sm text-gray-400">Features</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buildings List */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Your Buildings</h2>
                    <Link
                        href="/admin/buildings"
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {buildings.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No buildings yet. Create your first building!</p>
                        <Link
                            href="/admin/buildings"
                            className="inline-flex items-center gap-2 mt-4 text-amber-400 hover:text-amber-300 font-medium"
                        >
                            Add Building <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700/50">
                        {buildings.map((building) => (
                            <div
                                key={building.id}
                                className="p-6 hover:bg-gray-700/20 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                                        {building.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate">{building.name}</h3>
                                        <p className="text-sm text-gray-400 truncate">{building.location}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="text-white font-bold">{building.floors.length}</div>
                                            <div className="text-gray-500">Floors</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white font-bold">{building.features.length}</div>
                                            <div className="text-gray-500">Features</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-amber-400 font-bold">{building.possession}</div>
                                            <div className="text-gray-500">Possession</div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/admin/buildings?edit=${building.id}`}
                                        className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/buildings"
                    className="group bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all"
                >
                    <Building2 className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white mb-2">Manage Buildings</h3>
                    <p className="text-sm text-gray-400">Edit building info, features, and descriptions</p>
                </Link>

                <Link
                    href="/admin/floors"
                    className="group bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                >
                    <Layers className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white mb-2">Manage Floors</h3>
                    <p className="text-sm text-gray-400">Edit floor details, prices, and map images</p>
                </Link>

                <Link
                    href="/admin/data"
                    className="group bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all"
                >
                    <TrendingUp className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white mb-2">Export/Import</h3>
                    <p className="text-sm text-gray-400">Backup or restore your content data</p>
                </Link>
            </div>
        </div>
    );
}
