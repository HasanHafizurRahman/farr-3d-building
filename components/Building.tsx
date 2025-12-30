'use client';

import React, { useState } from 'react';
import { Edges, useCursor, useGLTF } from '@react-three/drei';
import { FloorData } from '@/lib/data';

interface BuildingProps {
    modelPath: string;
    floors: FloorData[];
    onFloorClick: (floor: FloorData) => void;
    isDragging?: boolean;
    showBlocks?: boolean;
}

export default function Building({ modelPath, floors, onFloorClick, isDragging = false, showBlocks = true }: BuildingProps) {
    // Enable Draco compression support
    const { scene } = useGLTF(modelPath, true) as any;

    return (
        <group position={[0, -8, 0]}>
            {/* The Visual Model */}
            <primitive object={scene} scale={0.5} />

            {/* Interactive Hitboxes - positioned inside the building */}
            {showBlocks && (
                <group position={[4, 2.2, -6]}>
                    {floors.map((floor, index) => (
                        <FloorHitbox
                            key={floor.id}
                            data={floor}
                            position={[0, index * 1.5, 0]}
                            onClick={() => !isDragging && onFloorClick(floor)}
                        />
                    ))}
                </group>
            )}
        </group>
    );
}

interface FloorHitboxProps {
    data: FloorData;
    position: [number, number, number];
    onClick: () => void;
}

function FloorHitbox({ data, position, onClick }: FloorHitboxProps) {
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    return (
        <group position={position}>
            {/* Transparent Hitbox Mesh with white border edges */}
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                <boxGeometry args={[6.5, 1.2, 8.5]} />
                <meshStandardMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
                {/* White border edges - always visible */}
                <Edges
                    threshold={15}
                    color="#ffffff"
                    lineWidth={1}
                />
            </mesh>
        </group>
    );
}