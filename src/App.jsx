import React, { useState, useEffect, useMemo } from "react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { Body } from "./components/Models/Body";
import setCubeTextureBackground from "./components/Models/TexturedCube"; // Import the function
import * as THREE from "three";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const bodyParts = {
  Skin: {
    Surface: ["skin"]
  },
  "Nervous System": {
    "Central Nervous System": ["brain", "spinal_cord"],
    "Sensory Organs": ["eyes"]
  },
  Skeleton: {
    "Upper Body": ["spine", "pelvis"],
    "Lower Body": ["legs", "rectus_femoris"]
  },
  Torso: {
    "Respiratory System": ["lung", "bronchus"],
    "Digestive System": ["liver", "pancreas"],
    "Urinary System": ["kidney"]
  },
  Abdomen: {
    "Digestive System": ["sm_intestine", "lg_intestine", "cystic_duct", "gallbladder", "spleen"],
    "Urinary System": ["urinary_bladder", "ureter", "urethra"],
    "Immune System": ["lymph_node", "thymus"]
  },
  Neck: {
    "Respiratory System": ["larynx", "trachea"],
    "Immune System": ["palatine_tonsil"],
    "Other": ["hyoid", "cricoarytenoid"]
  },
  "Reproductive System": {
    "Male": ["prostate"],
  },
  "Vascular System": {
    "Heart and Blood Vessels": ["heart", "blood_vasculature"]
  }
};


const Index = () => {
  const [visibility, setVisibility] = useState(
    Object.fromEntries(
      Object.values(bodyParts).flatMap(subCategories =>
        Object.values(subCategories).flatMap(parts =>
          parts.map(name => [name, true])
        )
      )
    )
  );


  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [cameraPosition, setCameraPosition] = useState([0, 1, 3]);
  const [isCameraRotationEnabled, setIsCameraRotationEnabled] = useState(true);
  const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  var isRotating = isCameraRotationEnabled;
  var setBackground = isBackgroundEnabled;

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const resetCamera = () => {
    setCameraPosition([0, 1, 3]);
  };

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
          enablePan={true}
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
      <h1 style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '10px', background: 'rgba(255,255,255,0.8)', textAlign: 'center', 'fontFamily': 'Arial' }}>
        Human Body Explorer
      </h1>
      <aside
        style={{
          position: 'absolute',
          top: 0,
          left: isSidebarOpen ? 0 : '-500px',
          width: '500px',
          padding: '10px',
          background: '#f0f0f0',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          height: '100vh'
        }}>
        {Object.entries(bodyParts).map(([category, subCategories]) => (
          <div key={category} style={{ marginBottom: '20px' }}>
            <h3 style={{
              userSelect: 'none'
            }}
              draggable={false}
            >
              {category}
            </h3>
            <hr style={{ marginBottom: '5px' }} />
            {Object.entries(subCategories).map(([subCategory, parts]) => (
              <div
                key={subCategory}
                style={{ marginBottom: '15px' }}
                draggable={false}
              >
                <h4 style={{ fontSize: '14px', marginBottom: '8px', userSelect: 'none' }}>{subCategory}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {parts.map((part) => (
                    <div
                      key={part}
                      onClick={() => toggleVisibility(part)}
                      style={{
                        width: 'calc(33% - 10px)', // Adjust width to fit 3 boxes per row
                        margin: '5px 0',
                        padding: '8px',
                        cursor: 'pointer',
                        backgroundColor: visibility[part] ? 'lightgreen' : 'lightcoral',
                        textAlign: 'center',
                        borderRadius: '5px',
                        userSelect: 'none'
                      }}
                      draggable={false}
                    >
                      {capitalize(part)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: '20px',
          left: isSidebarOpen ? '510px' : '10px',
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          color: 'white',
          background: 'darkgray',
          border: 'none',
          borderRadius: '5px',
          userSelect: 'none',
          transition: 'left 0.3s ease' // Smooth transition for button
        }}
        draggable={false}
      >
        {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: '20px', // Distance from the bottom of the screen
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Adjust for exact centering
          display: 'flex', // Use flexbox for horizontal alignment
          gap: '10px', // Space between buttons
        }}
      >
        <button
          style={{
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            color: 'white',
            background: 'blue',
            border: 'none',
            borderRadius: '5px',
          }}
          onClick={toggleCameraRotation}
        >
          {isCameraRotationEnabled ? 'Disable' : 'Enable'} Camera Rotation
        </button>
        <button
          style={{
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            color: 'white',
            background: 'green',
            border: 'none',
            borderRadius: '5px',
          }}
          onClick={resetCamera}
          hidden={!isCameraRotationEnabled}
        >
          Reset Camera Position
        </button>
      </div>


      {
        hoveredOrgan && (
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
            maxHeight: '80vh'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{hoveredOrgan?.name}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#555', textAlign: 'justify' }}>
              {hoveredOrgan?.description}
            </p>
          </div>
        )
      }
    </div >
  );
};

export default Index;
