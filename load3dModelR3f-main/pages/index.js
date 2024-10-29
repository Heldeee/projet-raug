import React, { useState, useEffect, useMemo } from "react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Leva } from "leva";
import { Body } from "../components/Models/Body";
import setCubeTextureBackground from "../components/Models/TexturedCube"; // Import the function

const bodyParts = {
  Head: ["heart", "brain", "eye"],
  Torso: ["lung", "liver", "kidney", "pancreas", "skin"],
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
  const [activeCategory, setActiveCategory] = useState("Head"); // Default active category

  // Custom component to set the background texture
  const Background = () => {
    const { scene } = useThree();
    useEffect(() => {
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
      <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} shadows>
        <Background /> {/* Set the background texture */}
        <color attach="background" args={["#eee"]} />
        <Environment preset="studio" />
        <PerspectiveCamera makeDefault position={[2, 3.9, 2]} />
        <OrbitControls />
        {lights}
        <Body
          position={[0, 0.8, 0]}
          visibility={visibility}
          setHoveredOrgan={setHoveredOrgan}
        />
        <ContactShadows />
      </Canvas>

      <aside style={{ position: 'absolute', top: 0, left: 0, width: '250px', padding: '10px', background: '#f0f0f0', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto', height: '100vh' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Body Parts</h2>
        {Object.keys(bodyParts).map(category => (
          <div key={category}>
            <h3
              onClick={() => setActiveCategory(category)}
              style={{
                cursor: 'pointer',
                padding: '5px',
                background: activeCategory === category ? '#ddd' : 'transparent',
              }}
            >
              {category}
            </h3>
            {activeCategory === category && (
              <ul style={{ paddingLeft: '10px' }}>
                {bodyParts[category].map(part => (
                  <li key={part}>
                    <label>
                      <input
                        type="checkbox"
                        checked={visibility[part]}
                        onChange={(e) => setVisibility((prev) => ({ ...prev, [part]: e.target.checked }))}
                      />
                      {part}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
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