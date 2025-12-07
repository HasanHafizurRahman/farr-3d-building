// lib/adminData.ts
'use client';

import { BuildingData, FloorData } from './data';

// Re-export types for convenience
export type { BuildingData, FloorData };

const ADMIN_DATA_KEY = 'admin_building_data';
const ADMIN_AUTH_KEY = 'admin_authenticated';
const ADMIN_PASSWORD = 'admin123'; // Simple password for demo

// Default data to use if no admin data exists
const defaultBuildingsData: BuildingData[] = [
    {
        id: 'farr-tower',
        name: 'Farr Tower',
        modelPath: 'https://architect-temp.vercel.app/asset.glb',
        description: 'A magnificent 10-storey residential tower redefining luxury living. Featuring panoramic views, state-of-the-art amenities, and a prime location.',
        location: 'Bashundhara, Dhaka',
        totalFloors: 10,
        possession: '2026',
        features: ['Panoramic Views', 'Infinity Pool', 'Smart Home System', 'Private Elevator'],
        floors: Array.from({ length: 10 }, (_, i) => ({
            id: `floor-${i + 1}`,
            level: i + 1,
            name: i === 0 ? 'Ground Floor - Lobby & Retail' : i === 9 ? 'Penthouse Level' : `${i + 1}th Floor - Residential`,
            price: i === 0 ? '$1,500,000' : i === 9 ? '$3,000,000' : `$${800 + (i * 50)},000`,
            size: i === 9 ? '4,500 sqft' : '3,200 sqft',
            description: i === 0
                ? 'Grand lobby entrance with concierge service and premium retail spaces.'
                : i === 9
                    ? 'Exclusive penthouse with private terrace, pool, and 360-degree city views.'
                    : 'Luxury 4-bedroom apartment with open-plan living, servant quarters, and dual balconies.',
            mapUrl: '/assets/home-plans-building-design-500x500.webp',
            color: `hsl(${210 + (i * 5)}, 70%, ${80 - (i * 3)}%)`,
            benefits: i === 0
                ? ['High Visibility', 'Concierge Service', 'Valet Parking']
                : ['City Views', 'Natural Light', 'Smart Automation', 'Soundproof Windows'],
        }))
    }
];

// Authentication functions
export const checkAdminAuth = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        return true;
    }
    return false;
};

export const logoutAdmin = (): void => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
};

// Data management functions
export const getAdminBuildingsData = (): BuildingData[] => {
    if (typeof window === 'undefined') return defaultBuildingsData;

    const stored = localStorage.getItem(ADMIN_DATA_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return defaultBuildingsData;
        }
    }
    return defaultBuildingsData;
};

export const saveAdminBuildingsData = (data: BuildingData[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
};

// Building CRUD
export const addBuilding = (building: BuildingData): void => {
    const data = getAdminBuildingsData();
    data.push(building);
    saveAdminBuildingsData(data);
};

export const updateBuilding = (id: string, updates: Partial<BuildingData>): void => {
    const data = getAdminBuildingsData();
    const index = data.findIndex(b => b.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveAdminBuildingsData(data);
    }
};

export const deleteBuilding = (id: string): void => {
    const data = getAdminBuildingsData().filter(b => b.id !== id);
    saveAdminBuildingsData(data);
};

// Floor CRUD
export const addFloor = (buildingId: string, floor: FloorData): void => {
    const data = getAdminBuildingsData();
    const building = data.find(b => b.id === buildingId);
    if (building) {
        building.floors.push(floor);
        building.totalFloors = building.floors.length;
        saveAdminBuildingsData(data);
    }
};

export const updateFloor = (buildingId: string, floorId: string, updates: Partial<FloorData>): void => {
    const data = getAdminBuildingsData();
    const building = data.find(b => b.id === buildingId);
    if (building) {
        const floorIndex = building.floors.findIndex(f => f.id === floorId);
        if (floorIndex !== -1) {
            building.floors[floorIndex] = { ...building.floors[floorIndex], ...updates };
            saveAdminBuildingsData(data);
        }
    }
};

export const deleteFloor = (buildingId: string, floorId: string): void => {
    const data = getAdminBuildingsData();
    const building = data.find(b => b.id === buildingId);
    if (building) {
        building.floors = building.floors.filter(f => f.id !== floorId);
        building.totalFloors = building.floors.length;
        saveAdminBuildingsData(data);
    }
};

// Export/Import
export const exportData = (): string => {
    return JSON.stringify(getAdminBuildingsData(), null, 2);
};

export const importData = (jsonString: string): boolean => {
    try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data)) {
            saveAdminBuildingsData(data);
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

// Reset to defaults
export const resetToDefaults = (): void => {
    saveAdminBuildingsData(defaultBuildingsData);
};

// Helper to get building by ID
export const getAdminBuildingById = (id: string): BuildingData | undefined => {
    return getAdminBuildingsData().find(building => building.id === id);
};

// Helper to get floor by ID
export const getAdminFloorByIdSimple = (floorId: string): { floor: FloorData; building: BuildingData } | undefined => {
    for (const building of getAdminBuildingsData()) {
        const floor = building.floors.find(f => f.id === floorId);
        if (floor) return { floor, building };
    }
    return undefined;
};
