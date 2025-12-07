// app/admin/buildings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
    getAdminBuildingsData,
    saveAdminBuildingsData,
    deleteBuilding,
    BuildingData
} from '@/lib/adminData';
import {
    Building2, Plus, Trash2, Edit2, X, Save, MapPin,
    Calendar, Layers, Star, ChevronDown, ChevronUp
} from 'lucide-react';

export default function BuildingsPage() {
    const [buildings, setBuildings] = useState<BuildingData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<BuildingData>>({});

    useEffect(() => {
        loadBuildings();
    }, []);

    const loadBuildings = () => {
        setBuildings(getAdminBuildingsData());
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingId(null);
        setFormData({
            id: `building-${Date.now()}`,
            name: '',
            modelPath: 'https://architect-temp.vercel.app/asset.glb',
            description: '',
            location: '',
            totalFloors: 0,
            possession: '',
            features: [],
            floors: []
        });
    };

    const handleEdit = (building: BuildingData) => {
        setEditingId(building.id);
        setIsCreating(false);
        setFormData({ ...building });
    };

    const handleSave = () => {
        if (!formData.name || !formData.location) {
            alert('Please fill in required fields');
            return;
        }

        const allBuildings = getAdminBuildingsData();

        if (isCreating) {
            allBuildings.push(formData as BuildingData);
        } else {
            const index = allBuildings.findIndex(b => b.id === editingId);
            if (index !== -1) {
                allBuildings[index] = { ...allBuildings[index], ...formData } as BuildingData;
            }
        }

        saveAdminBuildingsData(allBuildings);
        loadBuildings();
        setEditingId(null);
        setIsCreating(false);
        setFormData({});
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this building? This will also delete all floors.')) {
            deleteBuilding(id);
            loadBuildings();
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsCreating(false);
        setFormData({});
    };

    const handleFeatureChange = (index: number, value: string) => {
        const features = [...(formData.features || [])];
        features[index] = value;
        setFormData({ ...formData, features });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...(formData.features || []), '']
        });
    };

    const removeFeature = (index: number) => {
        const features = (formData.features || []).filter((_: string, i: number) => i !== index);
        setFormData({ ...formData, features });
    };

    const renderForm = () => (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                    {isCreating ? 'Create New Building' : 'Edit Building'}
                </h2>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Building Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="Enter building name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location *
                    </label>
                    <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="e.g., Bashundhara, Dhaka"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Possession Year
                    </label>
                    <input
                        type="text"
                        value={formData.possession || ''}
                        onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="e.g., 2026"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        3D Model URL
                    </label>
                    <input
                        type="text"
                        value={formData.modelPath || ''}
                        onChange={(e) => setFormData({ ...formData, modelPath: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="URL to .glb model"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none"
                    placeholder="Describe the building..."
                />
            </div>

            {/* Features */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Features</label>
                    <button
                        onClick={addFeature}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Add Feature
                    </button>
                </div>
                <div className="space-y-2">
                    {(formData.features || []).map((feature: string, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                                placeholder="e.g., Infinity Pool"
                            />
                            <button
                                onClick={() => removeFeature(index)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {isCreating ? 'Create Building' : 'Save Changes'}
                </button>
                <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Buildings</h1>
                    <p className="text-gray-400">Manage building information and features</p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Building
                    </button>
                )}
            </div>

            {/* Form */}
            {(isCreating || editingId) && renderForm()}

            {/* Buildings List */}
            <div className="space-y-4">
                {buildings.length === 0 ? (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No buildings yet</p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
                        >
                            <Plus className="w-4 h-4" /> Create your first building
                        </button>
                    </div>
                ) : (
                    buildings.map((building) => (
                        <div
                            key={building.id}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all"
                        >
                            <div
                                className="p-6 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === building.id ? null : building.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg flex-shrink-0">
                                        {building.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-white truncate">{building.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {building.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> {building.possession}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Layers className="w-4 h-4" /> {building.floors.length} Floors
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(building);
                                            }}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(building.id);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        {expandedId === building.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedId === building.id && (
                                <div className="px-6 pb-6 border-t border-gray-700/50 pt-4">
                                    <p className="text-gray-400 mb-4">{building.description}</p>

                                    {building.features.length > 0 && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                                <Star className="w-4 h-4 text-amber-400" /> Features
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {building.features.map((feature: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg text-sm font-medium"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
