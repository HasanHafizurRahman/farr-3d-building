// lib/api.ts
// API client for 3D Building Backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://farr-3d-building-backend.vercel.app/api';

// Helper to get auth headers
const getAuthHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Types
export interface FloorData {
    id: string;
    level: number;
    name: string;
    price: string;
    size: string;
    description: string;
    mapUrl: string;
    color: string;
    benefits: string[];
}

export interface BuildingData {
    id: string;
    name: string;
    modelPath: string;
    description: string;
    location: string;
    totalFloors: number;
    possession: string;
    features: string[];
    floors: FloorData[];
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}

export interface VerifyResponse {
    valid: boolean;
    user?: {
        _id: string;
        username: string;
    };
}

export interface ApiError {
    message: string;
}

// API Functions
export const api = {
    // === HEALTH CHECK ===
    healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) throw new Error('Server unavailable');
        return res.json();
    },

    // === AUTH ENDPOINTS ===
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    register: async (username: string, password: string): Promise<{ message: string }> => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        return data;
    },

    verifyToken: async (token: string): Promise<VerifyResponse> => {
        const res = await fetch(`${API_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.json();
    },

    // === PUBLIC ENDPOINTS (No Auth) ===
    getBuildings: async (): Promise<BuildingData[]> => {
        const res = await fetch(`${API_URL}/buildings`);
        if (!res.ok) throw new Error('Failed to fetch buildings');
        return res.json();
    },

    getBuilding: async (id: string): Promise<BuildingData> => {
        const res = await fetch(`${API_URL}/buildings/${id}`);
        if (!res.ok) throw new Error('Building not found');
        return res.json();
    },

    getFloor: async (floorId: string): Promise<FloorData & { buildingId: string; buildingName: string }> => {
        const res = await fetch(`${API_URL}/floors/${floorId}`);
        if (!res.ok) throw new Error('Floor not found');
        return res.json();
    },

    // === PROTECTED ENDPOINTS (Require Auth) ===
    createBuilding: async (data: Partial<BuildingData>, token: string): Promise<BuildingData> => {
        const res = await fetch(`${API_URL}/buildings`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to create building');
        return result;
    },

    updateBuilding: async (id: string, data: Partial<BuildingData>, token: string): Promise<BuildingData> => {
        const res = await fetch(`${API_URL}/buildings/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to update building');
        return result;
    },

    deleteBuilding: async (id: string, token: string): Promise<{ message: string }> => {
        const res = await fetch(`${API_URL}/buildings/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to delete building');
        return result;
    },

    addFloor: async (buildingId: string, floorData: Partial<FloorData>, token: string): Promise<BuildingData> => {
        const res = await fetch(`${API_URL}/buildings/${buildingId}/floors`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(floorData)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to add floor');
        return result;
    },

    updateFloor: async (buildingId: string, floorId: string, data: Partial<FloorData>, token: string): Promise<BuildingData> => {
        const res = await fetch(`${API_URL}/buildings/${buildingId}/floors/${floorId}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to update floor');
        return result;
    },

    deleteFloor: async (buildingId: string, floorId: string, token: string): Promise<BuildingData> => {
        const res = await fetch(`${API_URL}/buildings/${buildingId}/floors/${floorId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to delete floor');
        return result;
    },

    uploadFloorMap: async (floorId: string, file: File, token: string): Promise<{ message: string; mapUrl: string }> => {
        const formData = new FormData();
        formData.append('map', file);

        const res = await fetch(`${API_URL}/floors/${floorId}/upload-map`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: Content-Type is set automatically by browser for FormData
            },
            body: formData
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to upload map');
        return result;
    }
};

export default api;
