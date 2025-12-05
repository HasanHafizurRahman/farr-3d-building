// components/Building.tsx
'use client';

import React, { useState } from 'react';
import { Html, useCursor, useGLTF } from '@react-three/drei';
import { FloorData } from '@/lib/data';

interface BuildingProps {
    modelPath: string;
    floors: FloorData[];
    onFloorClick: (floor: FloorData) => void;
}

export default function Building({ modelPath, floors, onFloorClick }: BuildingProps) {
    const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
    const { scene } = useGLTF(modelPath);

    return (
        <group position={[0, -4, 0]}>
            {/* The Visual Model */}
            <primitive object={scene} scale={0.5} />

            {/* Interactive Hitboxes */}
            <group position={[0, -1.5, 0]}>
                {floors.map((floor, index) => (
                    <FloorHitbox
                        key={floor.id}
                        data={floor}
                        position={[0, index * 1.5, 0]}
                        isHovered={hoveredFloor === floor.id}
                        onHover={(isHovering) => setHoveredFloor(isHovering ? floor.id : null)}
                        onClick={() => onFloorClick(floor)}
                    />
                ))}
            </group>
        </group>
    );
}

interface FloorHitboxProps {
    data: FloorData;
    position: [number, number, number];
    isHovered: boolean;
    onHover: (isHovering: boolean) => void;
    onClick: () => void;
}

function FloorHitbox({ data, position, isHovered, onHover, onClick }: FloorHitboxProps) {
    useCursor(isHovered);

    return (
        <group position={position}>
            {/* Invisible Hitbox Mesh for interaction */}
            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onHover(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    onHover(false);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                <boxGeometry args={[3.5, 1.3, 3.5]} />
                <meshStandardMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>

            {/* Subtle edge indicator - only visible on hover */}
            {isHovered && (
                <group>
                    {/* Left edge bar */}
                    <mesh position={[-1.8, 0, 0]}>
                        <boxGeometry args={[0.08, 1.35, 3.6]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={0.8}
                            transparent
                            opacity={0.95}
                        />
                    </mesh>
                    {/* Right edge bar */}
                    <mesh position={[1.8, 0, 0]}>
                        <boxGeometry args={[0.08, 1.35, 3.6]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={0.8}
                            transparent
                            opacity={0.95}
                        />
                    </mesh>
                </group>
            )}

            {/* Tooltip on Hover */}
            {isHovered && (
                <Html position={[2.5, 0, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border w-96 transform transition-all duration-300 scale-100 origin-left">
                        {/* Map Image */}
                        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-gray-100">
                            <img
                                src={data.mapUrl}
                                alt={`${data.name} floor plan`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                                Floor {data.level}
                            </div>
                        </div>

                        {/* Floor Info */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{data.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 font-medium">{data.size}</span>
                                <span className="text-gray-800 font-bold text-lg">{data.price}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-800 uppercase tracking-wider font-semibold">Click to view details</p>
                            </div>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}