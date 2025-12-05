// components/Scene.tsx
'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Loader } from '@react-three/drei';
import Building from './Building';
import { FloorData } from '@/lib/data';
import { Suspense, useRef, useEffect } from 'react';

// import the runtime OrbitControls type for proper typing
import type { OrbitControls as ThreeOrbitControls } from 'three-stdlib';

interface SceneProps {
    buildingModelPath: string;
    floors: FloorData[];
    onFloorClick: (floor: FloorData) => void;
}

function InnerScene({ buildingModelPath, floors, onFloorClick }: SceneProps) {
    const { performance } = useThree();

    // strongly type the ref to the actual OrbitControls instance
    const controlsRef = useRef<ThreeOrbitControls | null>(null);

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
                position={[5, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            {/* <Environment preset="night" /> */}

            <Suspense fallback={null}>
                <group position={[0, 2, 0]}>
                    <Building modelPath={buildingModelPath} floors={floors} onFloorClick={onFloorClick} />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
                </group>
            </Suspense>

            {/* ref is forwarded to the underlying OrbitControls instance */}
            <OrbitControls
                ref={controlsRef}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
}

export default function Scene({ buildingModelPath, floors, onFloorClick }: SceneProps) {
    return (
        <div className="w-full h-screen bg-gray-50">
            <Canvas camera={{ position: [0, 10, 20], fov: 45 }} dpr={[1, 2]} shadows performance={{ min: 0.5 }}>
                <InnerScene buildingModelPath={buildingModelPath} floors={floors} onFloorClick={onFloorClick} />
            </Canvas>

            <Loader
                containerStyles={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}
                barStyles={{ background: 'linear-gradient(to right, #3b82f6, #a855f7)' }}
                dataStyles={{ color: '#1e293b', fontWeight: 'bold' }}
                dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
            />
        </div>
    );
}
