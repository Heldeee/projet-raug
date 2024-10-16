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
  });

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
        <Body position={[0, 0, 0]} visibility={visibility} />
        <ContactShadows />
      </Canvas>
    </div>
  );
};

export default Index;