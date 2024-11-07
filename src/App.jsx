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
import { XR, ARButton, VRButton } from '@react-three/xr';
import * as THREE from "three";
import { useRef } from 'react';
import './App.css';

const capitalize = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

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
    <div className="container">
      <Leva fill hideCopyButton />
      <ARButton />
      <Canvas className="canvas-container" shadows>
        <XR referenceSpace="local-floor">
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <OrbitControls
            target={[0, 1, -2]}
            enablePan={true}
            autoRotate={false}
            autoRotateSpeed={5}
            zoomToCursor={true}
          />
          {lights}
          <Body
            position={[0, 1, -2]}
            visibility={visibility}
            setHoveredOrgan={setHoveredOrgan}

          />
          <ContactShadows />
        </XR>
      </Canvas>

      <h1 className="title">Human Body Explorer</h1>

      <aside className={`sidebar sidebar-minimal ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {Object.entries(bodyParts).map(([category, subCategories]) => (
          <div key={category} className="category">
            <h3 className="category-title">{category}</h3>
            <hr className="category-divider" />
            {Object.entries(subCategories).map(([subCategory, parts]) => (
              <div key={subCategory} className="subcategory">
                <h4 className="subcategory-title">{subCategory}</h4>
                <div className="parts-grid">
                  {parts.map((part) => (
                    <div
                      key={part}
                      onClick={() => toggleVisibility(part)}
                      className={`part-button ${visibility[part] ? 'part-button-visible' : 'part-button-hidden'}`}
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
      <button
        onClick={toggleSidebar}
        className={`toggle-sidebar-btn ${isSidebarOpen ? 'toggle-sidebar-btn-open' : 'toggle-sidebar-btn-closed'}`}
      >
        {isSidebarOpen ? 'x' : 'Menu'}
      </button>

      {!hoveredOrgan && (
        <div className="organ-info">
          <h3 className="organ-title">{hoveredOrgan?.name}</h3>
          <p className="organ-description">{hoveredOrgan?.description}</p>
        </div>
      )}
    </div>
  );
};

export default Index;
