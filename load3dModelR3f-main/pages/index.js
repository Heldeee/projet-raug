import React, { useState } from "react";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { Body } from "../components/Models/Body";

const Index = () => {
  // State to control visibility of heart parts
  const [visibility, setVisibility] = useState({
    heart: true,
    brain: true,
    eye: true,
    kidney: true,
    liver: true,
    pancreas: true,
    sm_intestine: true,
    lung: true,
    skin: true,
    lg_intestine: true,
    prostate: true,
    pelvis: true,
    legs: true,
    blood_vasculature: true,
    urinary_bladder: true,
    ureter: true,
    larynx: true,
    lymph_node: true,
    bronchus: true,
    palatine_tonsil: true,
    spinal_cord: true,
    spleen: true,
    thymus: true,
    trachea: true,
    vertebrae: true,
    rectus_femoris: true,
    cricoarytenoid: true,
    cystic_duct: true,
    gallbladder: true,
    urethra: true,
    hyoid: true,
  });

  const [hoveredOrgan, setHoveredOrgan] = useState(null);

  const controls = useControls({
    Heart: {
      value: visibility.heart,
      onChange: (v) => setVisibility((prev) => ({ ...prev, heart: v })),
    },
    Brain: {
      value: visibility.brain,
      onChange: (v) => setVisibility((prev) => ({ ...prev, brain: v })),
    },
    Eye: {
      value: visibility.eye,
      onChange: (v) => setVisibility((prev) => ({ ...prev, eye: v })),
    },
    Kidney: {
      value: visibility.kidney,
      onChange: (v) => setVisibility((prev) => ({ ...prev, kidney: v })),
    },
    Liver: {
      value: visibility.liver,
      onChange: (v) => setVisibility((prev) => ({ ...prev, liver: v })),
    },
    Pancreas: {
      value: visibility.pancreas,
      onChange: (v) => setVisibility((prev) => ({ ...prev, pancreas: v })),
    },
    Small_Intestine: {
      value: visibility.sm_intestine,
      onChange: (v) => setVisibility((prev) => ({ ...prev, sm_intestine: v })),
    },
    Lung: {
      value: visibility.lung,
      onChange: (v) => setVisibility((prev) => ({ ...prev, lung: v })),
    },
    Skin: {
      value: visibility.skin,
      onChange: (v) => setVisibility((prev) => ({ ...prev, skin: v })),
    },
    Large_Intestine: {
      value: visibility.lg_intestine,
      onChange: (v) => setVisibility((prev) => ({ ...prev, lg_intestine: v })),
    },
    Prostate: {
      value: visibility.prostate,
      onChange: (v) => setVisibility((prev) => ({ ...prev, prostate: v })),
    },
    Pelvis: {
      value: visibility.pelvis,
      onChange: (v) => setVisibility((prev) => ({ ...prev, pelvis: v })),
    },
    Legs: {
      value: visibility.legs,
      onChange: (v) => setVisibility((prev) => ({ ...prev, legs: v })),
    },
    Blood_Vasculature: {
      value: visibility.blood_vasculature,
      onChange: (v) => setVisibility((prev) => ({ ...prev, blood_vasculature: v })),
    },
    Urinal_Bladder: {
      value: visibility.urinary_bladder,
      onChange: (v) => setVisibility((prev) => ({ ...prev, urinary_bladder: v })),
    },
    Ureter: {
      value: visibility.ureter,
      onChange: (v) => setVisibility((prev) => ({ ...prev, ureter: v })),
    },
    Larynx: {
      value: visibility.larynx,
      onChange: (v) => setVisibility((prev) => ({ ...prev, larynx: v })),
    },
    Lymph_Node: {
      value: visibility.lymph_node,
      onChange: (v) => setVisibility((prev) => ({ ...prev, lymph_node: v })),
    },
    Bronchus: {
      value: visibility.bronchus,
      onChange: (v) => setVisibility((prev) => ({ ...prev, bronchus: v })),
    },
    Palatine_Tonsil: {
      value: visibility.palatine_tonsil,
      onChange: (v) => setVisibility((prev) => ({ ...prev, palatine_tonsil: v })),
    },
    Spinal_cord: {
      value: visibility.spinal_cord,
      onChange: (v) => setVisibility((prev) => ({ ...prev, spinal_cord: v })),
    },
    Spleen: {
      value: visibility.spleen,
      onChange: (v) => setVisibility((prev) => ({ ...prev, spleen: v })),
    },
    Thymus: {
      value: visibility.thymus,
      onChange: (v) => setVisibility((prev) => ({ ...prev, thymus: v })),
    },
    Trachea: {
      value: visibility.trachea,
      onChange: (v) => setVisibility((prev) => ({ ...prev, trachea: v })),
    },
    Vertebrae: {
      value: visibility.vertebrae,
      onChange: (v) => setVisibility((prev) => ({ ...prev, vertebrae: v })),
    },
    Rectus_Femoris: {
      value: visibility.rectus_femoris,
      onChange: (v) => setVisibility((prev) => ({ ...prev, rectus_femoris: v })),
    },
    Cricoarytenoid: {
      value: visibility.cricoarytenoid,
      onChange: (v) => setVisibility((prev) => ({ ...prev, cricoarytenoid: v })),
    },
    Cystic_Duct: {
      value: visibility.cystic_duct,
      onChange: (v) => setVisibility((prev) => ({ ...prev, cystic_duct: v })),
    },
    Gallbladder: {
      value: visibility.gallbladder,
      onChange: (v) => setVisibility((prev) => ({ ...prev, gallbladder: v })),
    },
    Urethra: {
      value: visibility.urethra,
      onChange: (v) => setVisibility((prev) => ({ ...prev, urethra: v })),
    },
    Hyoid: {
      value: visibility.hyoid,
      onChange: (v) => setVisibility((prev) => ({ ...prev, hyoid: v })),
    },
  });

  return (
    <div className="h-[100vh]">
      <Leva />
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <color attach="background" args={["#eee"]} />
        <Environment preset="studio" />
        <PerspectiveCamera makeDefault position={[2, 3.9, 2]} />
        <OrbitControls />
        <Body position={[0, 0.8, 0]} visibility={visibility} setHoveredOrgan={setHoveredOrgan} />
        <ContactShadows />
      </Canvas>
      {hoveredOrgan && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            maxWidth: '300px', // Optional, to restrict width
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' // Adds a little shadow for better visibility
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{hoveredOrgan.name}</h3>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#555' }}>{hoveredOrgan.description}</p>
        </div>
      )}
    </div>
  );
};

export default Index;