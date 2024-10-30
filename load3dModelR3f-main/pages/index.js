import React, { useState, useEffect, useMemo } from "react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { Body } from "../components/Models/Body";
import setCubeTextureBackground from "../components/Models/TexturedCube"; // Import the function
import * as THREE from "three";

const bodyParts = {
  Skin: ["skin"],
  Head: ["brain", "eye"],
  Torso: ["lung", "liver", "kidney", "pancreas", "heart"],
  Abdomen: ["sm_intestine", "lg_intestine", "urinary_bladder", "ureter"],
  Limbs: ["legs", "pelvis"],
  Neck: ["larynx", "trachea"],
  Blood: ["blood_vasculature"],
};

const Index = () => {
  const [visibility, setVisibility] = useState(
    Object.fromEntries(Object.values(bodyParts).flatMap(part => part.map(name => [name, true])))
  );

  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Skin"); // Default active category
  const [cameraPosition, setCameraPosition] = useState([0, 1, 3]);
  const [isCameraRotationEnabled, setIsCameraRotationEnabled] = useState(true);
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(true);

  const resetCamera = () => {
    setCameraPosition([0, 1, 3]);
    console.log("Camera reset");
  };

  var isRotating = isCameraRotationEnabled;
  var setBackground = isBackgroundEnabled;

  const toggleCameraRotation = () => {
    setIsCameraRotationEnabled(prev => !prev);
  }

  const toggleBackground = () => {
    setIsBackgroundEnabled(prev => !prev);
  }

  const toggleVisibility = (part) => {
    setVisibility((prev) => ({ ...prev, [part]: !prev[part] }));
  }

  // Custom component to set the background texture
  const Background = () => {
    const { scene } = useThree();
    useEffect(() => {
      if (isBackgroundEnabled)
        setCubeTextureBackground(scene);
    }, [scene]);
    return null;
  };

  // Memoize the lights to prevent re-renders
  const lights = useMemo(() => (
    <>
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  ), []);

  return (
    <div className="h-[100vh] w-[100vw] relative">
      <Leva
        fill
        hideCopyButton
      />
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} shadows>
        <Background /> {/* Set the background texture */}
        <color attach="background" args={["#eee"]} />
        <Environment preset="studio" />
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls
          target={[0, 1, 0]}
          enablePan={false}
          autoRotate={isRotating}
          autoRotateSpeed={5}
          zoomToCursor={true}
        />
        {lights}
        <Body
          position={[0, 1, 0]}
          visibility={visibility}
          setHoveredOrgan={setHoveredOrgan}
        />
        <ContactShadows />
      </Canvas>

      <aside style={{ position: 'absolute', top: 0, left: 0, width: '400px', padding: '10px', background: '#f0f0f0', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto', height: '100vh' }}>
        {Object.entries(bodyParts).map(([category, parts]) => (
          <div key={category} style={{ marginBottom: '20px' }}>
            <h3>{category}</h3>
            <hr style={{ marginBottom: '5px' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {parts.map(part => (
                <div
                  key={part}
                  onClick={() => toggleVisibility(part)}
                  style={{
                    width: 'calc(50% - 10px)',
                    margin: '5px',
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: visibility[part] ? 'lightgreen' : 'lightcoral',
                    textAlign: 'center',
                    borderRadius: '5px',
                  }}
                >
                  {part}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          style={{ marginTop: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer', color: 'white', background: 'blue', border: 'none', borderRadius: '5px' }}
          onClick={toggleCameraRotation}
        >
          {isCameraRotationEnabled ? 'Disable' : 'Enable'} Camera Rotation
        </button>
        <button
          style={{ marginTop: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer', color: 'white', background: 'blue', border: 'none', borderRadius: '5px' }}
          onClick={toggleBackground}
        >
          {setBackground ? 'Remove' : 'Add'} Background
        </button>
      </aside>


      {hoveredOrgan && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          maxWidth: '90vw',
          width: '400px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          maxHeight: '90vh'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{hoveredOrgan?.name}</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#555', textAlign: 'justify' }}>
            {hoveredOrgan?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
