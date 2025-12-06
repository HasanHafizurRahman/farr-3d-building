// lib/data.ts
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
}

export const buildingsData: BuildingData[] = [
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
            mapUrl: '/assets/home-plans-building-design-500x500.webp', // Placeholder, using existing asset
            color: `hsl(${210 + (i * 5)}, 70%, ${80 - (i * 3)}%)`,
            benefits: i === 0
                ? ['High Visibility', 'Concierge Service', 'Valet Parking']
                : ['City Views', 'Natural Light', 'Smart Automation', 'Soundproof Windows'],
        }))
    }
];

// Helper function to get building by ID
export const getBuildingById = (id: string): BuildingData | undefined => {
    return buildingsData.find(building => building.id === id);
};

// Helper function to get floor by building ID and floor ID
export const getFloorById = (buildingId: string, floorId: string): FloorData | undefined => {
    const building = getBuildingById(buildingId);
    if (!building) return undefined;
    return building.floors.find(floor => floor.id === floorId);
};

// Helper function to get floor by ID only (uses first building)
export const getFloorByIdSimple = (floorId: string): { floor: FloorData; building: BuildingData } | undefined => {
    for (const building of buildingsData) {
        const floor = building.floors.find(f => f.id === floorId);
        if (floor) return { floor, building };
    }
    return undefined;
};