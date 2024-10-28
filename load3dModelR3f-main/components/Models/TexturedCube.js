import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export const SpatialCube = ({
    position = [0, 0, 0],
    size = 10, // Increased size
    textureUrl = '/doctor-office.jpg',
    wireframeColor = '#ffffff'
}) => {
    // Load and configure texture
    const texture = useLoader(THREE.TextureLoader, textureUrl);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;

    // Create materials for each face
    const materials = [
        new THREE.MeshBasicMaterial({ color: '#000000' }), // right
        new THREE.MeshBasicMaterial({ color: '#000000' }), // left
        new THREE.MeshBasicMaterial({ color: '#000000' }), // top
        new THREE.MeshBasicMaterial({ color: '#000000' }), // bottom
        new THREE.MeshBasicMaterial({ map: texture }), // front - main image
        new THREE.MeshBasicMaterial({ color: '#000000' }), // back
    ];

    return (
        <group position={position} rotation={[Math.PI / 8, -Math.PI / 4, 0]}>
            {/* Main cube */}
            <mesh>
                <boxGeometry args={[size, size, size]} />
                {materials.map((material, index) => (
                    <meshBasicMaterial attach={`material-${index}`} key={index} {...material} />
                ))}
            </mesh>

            {/* Wireframe overlay */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
                <lineBasicMaterial color={wireframeColor} />
            </lineSegments>
        </group>
    );
};

// Example usage in your Index component
export const Room = () => {
    return (
        <Canvas
            camera={{ position: [15, 15, 15], fov: 50 }}
            style={{ width: '100%', height: '100vh' }}
        >
            <color attach="background" args={['#000000']} />
            <SpatialCube
                position={[0, 0, 0]}
                textureUrl="/dental-office.jpg"
                wireframeColor="#ffffff"
            />
            <OrbitControls enableZoom={true} enablePan={true} />
            <ambientLight intensity={0.5} />
        </Canvas>
    );
};

export default SpatialCube;