import * as THREE from 'three';

const setCubeTextureBackground = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('office/');

    const textureCube = loader.load([
        'px.png', // Negative X
        'nx.png', // Positive X
        'py.png', // Positive Y
        'ny.png', // Negative Y
        'pz.png', // Positive Z
        'nz.png'  // Negative Z
    ]);

    scene.background = textureCube;
};

export default setCubeTextureBackground;