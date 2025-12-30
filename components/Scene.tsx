// components/Scene.tsx
'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress } from '@react-three/drei';
import Building from './Building';
import BuildingLoader from './BuildingLoader';
import { FloorData } from '@/lib/data';
import { Suspense, useRef, useEffect, useState } from 'react';

// import the runtime OrbitControls type for proper typing
import type { OrbitControls as ThreeOrbitControls } from 'three-stdlib';

interface SceneProps {
    buildingModelPath: string;
    floors: FloorData[];
    onFloorClick: (floor: FloorData) => void;
}

function LoadingOverlay() {
    const { progress, active } = useProgress();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!active && progress === 100) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => setShow(false), 200);
            return () => clearTimeout(timer);
        }
    }, [active, progress]);

    if (!show) return null;

    return <BuildingLoader />;
}

function InnerScene({ buildingModelPath, floors, onFloorClick, showBlocks = true }: SceneProps & { showBlocks?: boolean }) {
    const { performance } = useThree();

    // strongly type the ref to the actual OrbitControls instance
    const controlsRef = useRef<ThreeOrbitControls | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const regress = () => performance.regress();
        controls.addEventListener('change', regress);

        return () => controls.removeEventListener('change', regress);
    }, [performance]);

    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight
                position={[15, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            {/* <Environment preset="night" /> */}

            <Suspense fallback={null}>
                <group position={[-8, -2, 4]}>
                    <Building
                        modelPath={buildingModelPath}
                        floors={floors}
                        onFloorClick={onFloorClick}
                        isDragging={isDragging}
                        showBlocks={showBlocks}
                    />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={20} blur={2.5} far={4.5} resolution={256} frames={1} />
                </group>
            </Suspense>

            {/* ref is forwarded to the underlying OrbitControls instance */}
            <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom={true}
                enableDamping={false}
                rotateSpeed={0.5}
                minPolarAngle={0.5}
                maxPolarAngle={Math.PI / 2}
                minDistance={15}
                maxDistance={80}
                onStart={() => setIsDragging(true)}
                onEnd={() => setIsDragging(false)}
            />
        </>
    );
}

export default function Scene({ buildingModelPath, floors, onFloorClick }: SceneProps) {
    const [showBlocks, setShowBlocks] = useState(true);

    return (
        <div className="w-full h-screen relative">
            <Canvas camera={{ position: [10, 20, 30], fov: 45 }} dpr={[1, 1.5]} shadows performance={{ min: 0.5 }}>
                <InnerScene
                    buildingModelPath={buildingModelPath}
                    floors={floors}
                    onFloorClick={onFloorClick}
                    showBlocks={showBlocks}
                />
            </Canvas>

            {/* Show/Hide Blocks Toggle Buttons */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-xs font-semibold text-gray-600 mb-2 text-center">Floor Blocks</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowBlocks(true)}
                        className={`px-3 py-1.5 cursor-pointer rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${showBlocks
                            ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                            : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        Show
                    </button>
                    <button
                        onClick={() => setShowBlocks(false)}
                        className={`px-3 py-1.5 cursor-pointer rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${!showBlocks
                            ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        Hide
                    </button>
                </div>
            </div>

            {/* Custom Building Loader */}
            <LoadingOverlay />
        </div>
    );
}

