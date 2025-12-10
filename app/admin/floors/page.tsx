// app/admin/floors/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { api, BuildingData, FloorData, getImageUrl } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
    Layers, Plus, Trash2, Edit2, X, Save, Building2,
    DollarSign, Maximize2, FileText, Image, Check, Upload
} from 'lucide-react';

export default function FloorsPage() {
    const { token } = useAuth();
    const [buildings, setBuildings] = useState<BuildingData[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
    const [editingFloorId, setEditingFloorId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<FloorData>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        api.getBuildings()
            .then(data => {
                setBuildings(data);
                if (data.length > 0 && !selectedBuildingId) {
                    setSelectedBuildingId(data[0].id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load buildings:', err);
                setError('Failed to load buildings');
                setLoading(false);
            });
    };

    const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
    const floors = selectedBuilding?.floors || [];

    const handleCreate = () => {
        if (!selectedBuildingId) {
            alert('Please select a building first');
            return;
        }

        const nextLevel = floors.length + 1;
        setIsCreating(true);
        setEditingFloorId(null);
        setFormData({
            // backend assigns ID
            level: nextLevel,
            name: `${nextLevel}th Floor - Residential`,
            price: '$500,000',
            size: '2,500 sqft',
            description: '',
            mapUrl: '',
            color: `hsl(${210 + (nextLevel * 5)}, 70%, ${80 - (nextLevel * 3)}%)`,
            benefits: []
        });
    };

    const handleEdit = (floor: FloorData) => {
        setEditingFloorId(floor.id);
        setIsCreating(false);
        setFormData({ ...floor });
        setSelectedFile(null);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) {
            alert('Please fill in required fields (Name, Price)');
            return;
        }

        if (!token) {
            alert('You must be logged in to save changes');
            return;
        }

        setSaving(true);
        try {
            let floorId = editingFloorId;

            if (isCreating) {
                const newFloor = await api.addFloor(selectedBuildingId, formData, token);
                floorId = newFloor.id; // Correctly get the ID from the returned BuildingData or FloorData?? 
                // Wait, addFloor returns BuildingData... we need to find the new floor ID or better yet, verify API response.
                // Actually in api.ts: addFloor returns BuildingData. This is tricky. 
                // We need to assume the backend adds it and we might need to fetch it or guess it?
                // Actually, let's look at api.ts again. addFloor returns BuildingData.
                // This means we might need to find the floor with the highest ID or matching our temp data?
                // Or maybe we can rely on order. 
                // Let's refector this part in a bit, or assume the backend logic.
                // Correction: The user prompt example implies we get a URL back from upload.
                // The prompt says: POST /api/floors/:floorId/upload-map
                // We need the floorId. 
                // If addFloor returns the updated Building, we can find the floor that matches our criteria or was just added.
                // Let's assume the last floor in the array is the new one for now, or use the level.

                // NOTE: Since I can't easily change the backend response for addFloor right now to return just the ID,
                // I will search for the floor in the returned building data.
                const createdFloor = newFloor.floors.find(f => f.level === formData.level && f.name === formData.name);
                if (createdFloor) floorId = createdFloor.id;
            } else if (editingFloorId) {
                await api.updateFloor(selectedBuildingId, editingFloorId, formData, token);
            }

            // Handle File Upload
            if (floorId && selectedFile) {
                await api.uploadFloorMap(floorId, selectedFile, token);
            }

            // Refresh data to get updated floor list
            const updatedBuildings = await api.getBuildings();
            setBuildings(updatedBuildings);

            handleCancel();
        } catch (err: any) {
            console.error('Failed to save floor:', err);
            alert(err.message || 'Failed to save floor');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (floorId: string) => {
        if (!token) return;

        if (confirm('Are you sure you want to delete this floor?')) {
            try {
                await api.deleteFloor(selectedBuildingId, floorId, token);

                // Refresh data
                const updatedBuildings = await api.getBuildings();
                setBuildings(updatedBuildings);
            } catch (err: any) {
                console.error('Failed to delete floor:', err);
                alert(err.message || 'Failed to delete floor');
            }
        }
    };

    const handleCancel = () => {
        setEditingFloorId(null);
        setIsCreating(false);
        setFormData({});
        setSelectedFile(null);
    };

    const handleBenefitChange = (index: number, value: string) => {
        const benefits = [...(formData.benefits || [])];
        benefits[index] = value;
        setFormData({ ...formData, benefits });
    };

    const addBenefit = () => {
        setFormData({
            ...formData,
            benefits: [...(formData.benefits || []), '']
        });
    };

    const removeBenefit = (index: number) => {
        const benefits = (formData.benefits || []).filter((_: string, i: number) => i !== index);
        setFormData({ ...formData, benefits });
    };

    const renderForm = () => (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                    {isCreating ? 'Create New Floor' : 'Edit Floor'}
                </h2>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Floor Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="e.g., Ground Floor - Lobby"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Level Number
                    </label>
                    <input
                        type="number"
                        value={formData.level || 1}
                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price *
                    </label>
                    <input
                        type="text"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="e.g., $500,000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Size
                    </label>
                    <input
                        type="text"
                        value={formData.size || ''}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                        placeholder="e.g., 2,500 sqft"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Map/Floor Plan Image
                    </label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-900/50 hover:bg-gray-800/50 hover:border-amber-500/50 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {(selectedFile || formData.mapUrl) && (
                            <div className="w-32 h-32 bg-black/50 rounded-xl border border-gray-700 overflow-hidden relative flex items-center justify-center">
                                {selectedFile ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={getImageUrl(formData.mapUrl || '')}
                                        alt="Current Map"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                                        }}
                                    />
                                )}
                                {selectedFile && (
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {selectedFile && (
                        <p className="text-xs text-amber-400 mt-2">
                            * File selected: {selectedFile.name}
                        </p>
                    )}
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
                    placeholder="Describe this floor..."
                />
            </div>

            {/* Benefits */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Benefits / Features</label>
                    <button
                        onClick={addBenefit}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Add Benefit
                    </button>
                </div>
                <div className="space-y-2">
                    {(formData.benefits || []).map((benefit: string, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={benefit}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                                placeholder="e.g., City Views"
                            />
                            <button
                                onClick={() => removeBenefit(index)}
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
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isCreating ? 'Create Floor' : 'Save Changes'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={loadData}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Floors</h1>
                    <p className="text-gray-400">Manage floor details, pricing, and maps</p>
                </div>
                {!isCreating && !editingFloorId && selectedBuildingId && (
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Floor
                    </button>
                )}
            </div>

            {/* Building Selector */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Building
                </label>
                <div className="flex flex-wrap gap-2">
                    {buildings.length === 0 ? (
                        <p className="text-gray-500 text-sm">No buildings found</p>
                    ) : (
                        buildings.map((building) => (
                            <button
                                key={building.id}
                                onClick={() => {
                                    setSelectedBuildingId(building.id);
                                    handleCancel();
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${selectedBuildingId === building.id
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:border-gray-500'
                                    }`}
                            >
                                <Building2 className="w-4 h-4" />
                                {building.name}
                                <span className="bg-gray-600/50 px-2 py-0.5 rounded text-xs">
                                    {building.floors?.length || 0}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Form */}
            {(isCreating || editingFloorId) && renderForm()}

            {/* Floors List */}
            {buildings.length === 0 ? (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No buildings available</p>
                    <p className="text-gray-500 text-sm">Create a building first to add floors</p>
                </div>
            ) : floors.length === 0 ? (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-12 text-center">
                    <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No floors in {selectedBuilding?.name}</p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add first floor
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {floors.map((floor: FloorData) => (
                        <div
                            key={floor.id}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
                        >
                            {/* Floor Header */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg"
                                            style={{ backgroundColor: floor.color || '#f59e0b' }}
                                        >
                                            {floor.level}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white truncate max-w-[180px]">{floor.name}</h3>
                                            <div className="text-amber-400 font-semibold">{floor.price}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(floor)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(floor.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Floor Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Maximize2 className="w-4 h-4" />
                                        <span>{floor.size}</span>
                                    </div>
                                    {floor.mapUrl && (
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Image className="w-4 h-4" />
                                            <span className="truncate">Map configured</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <FileText className="w-4 h-4" />
                                        <span>{floor.benefits.length} benefits</span>
                                    </div>
                                </div>
                                {/* Benefits Preview */}
                                {floor.benefits.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                                        <div className="flex flex-wrap gap-1">
                                            {floor.benefits.slice(0, 3).map((benefit: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    {benefit}
                                                </span>
                                            ))}
                                            {floor.benefits.length > 3 && (
                                                <span className="text-gray-500 text-xs px-2 py-0.5">
                                                    +{floor.benefits.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
