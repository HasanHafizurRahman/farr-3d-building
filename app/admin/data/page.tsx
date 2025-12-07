// app/admin/data/page.tsx
'use client';

import React, { useState } from 'react';
import {
    exportData,
    importData,
    resetToDefaults,
    getAdminBuildingsData
} from '@/lib/adminData';
import {
    Download, Upload, RefreshCw, Copy, Check,
    AlertTriangle, Database, FileJson
} from 'lucide-react';

export default function DataPage() {
    const [exportedData, setExportedData] = useState('');
    const [importInput, setImportInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleExport = () => {
        const data = exportData();
        setExportedData(data);
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
        a.download = `building-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        if (!importInput.trim()) {
            alert('Please paste JSON data first');
            return;
        }

        const success = importData(importInput);
        if (success) {
            setImportStatus('success');
            setImportInput('');
            setTimeout(() => setImportStatus('idle'), 3000);
        } else {
            setImportStatus('error');
            setTimeout(() => setImportStatus('idle'), 3000);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImportInput(content);
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
            resetToDefaults();
            alert('Data has been reset to defaults');
        }
    };

    const buildings = getAdminBuildingsData();
    const totalFloors = buildings.reduce((acc, b) => acc + b.floors.length, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Export / Import Data</h1>
                <p className="text-gray-400">Backup your building data or restore from a previous backup</p>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <Database className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Current Data</h2>
                        <p className="text-gray-400 text-sm">
                            {buildings.length} building(s), {totalFloors} floor(s)
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Export Section */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Download className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Export Data</h2>
                            <p className="text-gray-400 text-sm">Download your data as JSON</p>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mb-4"
                    >
                        <FileJson className="w-5 h-5" />
                        Generate Export
                    </button>

                    {exportedData && (
                        <>
                            <textarea
                                value={exportedData}
                                readOnly
                                rows={8}
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

                {/* Import Section */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <Upload className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Import Data</h2>
                            <p className="text-gray-400 text-sm">Restore data from JSON backup</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block w-full cursor-pointer">
                            <div className="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-xl p-6 text-center transition-colors">
                                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">
                                    Click to upload JSON file
                                </p>
                                <p className="text-gray-500 text-xs mt-1">or paste JSON below</p>
                            </div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <textarea
                        value={importInput}
                        onChange={(e) => setImportInput(e.target.value)}
                        placeholder="Paste JSON data here..."
                        rows={6}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 text-sm font-mono resize-none mb-4 placeholder-gray-600"
                    />

                    {importStatus === 'success' && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            Data imported successfully!
                        </div>
                    )}

                    {importStatus === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Invalid JSON format. Please check your data.
                        </div>
                    )}

                    <button
                        onClick={handleImport}
                        disabled={!importInput.trim()}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Upload className="w-5 h-5" />
                        Import Data
                    </button>
                </div>
            </div>

            {/* Reset Section */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-white mb-1">Danger Zone</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Reset all data to default values. This action cannot be undone.
                        </p>
                        <button
                            onClick={handleReset}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-2 px-4 rounded-xl transition-all flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
