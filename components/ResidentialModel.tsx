// components/ResidentialModel.tsx
'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type GLTFResult = any; // keep flexible for auto-generated gltfjsx outputs

export default function ResidentialModel({ modelPath, ...props }: { modelPath: string } & React.ComponentProps<'group'>) {
    // If using DRACO or meshopt you can configure loaders globally during app init,
    // or use useGLTF with a DRACO decoder path if necessary.
    const gltf = useGLTF(modelPath) as GLTFResult;

    // render all meshes from gltf
    return (
        <group {...props} dispose={null}>
            {Object.values(gltf.nodes || {}).map((node: any, i: number) => {
                if (!node || !node.isMesh) return null;
                return (
                    <mesh key={i} geometry={node.geometry} material={node.material} castShadow receiveShadow />
                );
            })}
        </group>
    );
}

// nice to preload both models at app start (call in root layout or page)
// useGLTF.preload('/models/residential_building-compressed.glb');
// useGLTF.preload('/models/mini-office-building.glb');
useGLTF.preload('https://architect-temp.vercel.app/asset.glb');
