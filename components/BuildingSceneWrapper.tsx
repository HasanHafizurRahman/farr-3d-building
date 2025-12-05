'use client';

import { useRouter } from 'next/navigation';
import Scene from './Scene';
import { FloorData } from '@/lib/data';

interface BuildingSceneWrapperProps {
    buildingModelPath: string;
    floors: FloorData[];
    buildingId: string;
}

export default function BuildingSceneWrapper({
    buildingModelPath,
    floors,
    buildingId
}: BuildingSceneWrapperProps) {
    const router = useRouter();

    const handleFloorClick = (floor: FloorData) => {
        router.push(`/building/${buildingId}/floor/${floor.id}`);
    };

    return (
        <Scene
            buildingModelPath={buildingModelPath}
            floors={floors}
            onFloorClick={handleFloorClick}
        />
    );
}
