// app/admin/data/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { api, BuildingData } from '@/lib/api';
import {
    Download, Copy, Check, Database, FileJson, AlertCircle
} from 'lucide-react';

export default function DataPage() {
    const [exportedData, setExportedData] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buildingsCount, setBuildingsCount] = useState(0);
    const [floorsCount, setFloorsCount] = useState(0);

    // Load initial stats
    useEffect(() => {
        api.getBuildings()
            .then(data => {
                setBuildingsCount(data.length);
                setFloorsCount(data.reduce((acc, b) => acc + (b.floors?.length || 0), 0));
            })
            .catch(console.error);
    }, []);

    const handleExport = async () => {
        setLoading(true);
        try {
            const data = await api.getBuildings();
            setExportedData(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('Failed to fetch data for export');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(exportedData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert('Failed to copy to clipboard');
        }
    };

    const handleDownload = () => {
        const blob = new Blob([exportedData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `building-data-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Export Data</h1>
                <p className="text-gray-400">Backup your building data as JSON.</p>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <Database className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Current Database Stats</h2>
                        <p className="text-gray-400 text-sm">
                            {buildingsCount} building(s), {floorsCount} floor(s) live on server
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-1 gap-6">
                {/* Export Section */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Download className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Export Data</h2>
                            <p className="text-gray-400 text-sm">Download your full dataset</p>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                            <strong>Note:</strong> Bulk import is currently disabled as it requires direct database access. Use this export for backup purposes only.
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                        ) : (
                            <FileJson className="w-5 h-5" />
                        )}
                        {loading ? 'Fetching Data...' : 'Generate Export'}
                    </button>

                    {exportedData && (
                        <>
                            <textarea
                                value={exportedData}
                                readOnly
                                rows={15}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 text-sm font-mono resize-none mb-4"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
