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
  });

  const controls = useControls({
    Heart: {
      value: visibility.heart,
      onChange: (v) => setVisibility((prev) => ({ ...prev, heart: v })),
    },
    Brain: {
      value: visibility.brain,
      onChange: (v) => setVisibility((prev) => ({ ...prev, brain: v })),
    }
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
        <PerspectiveCamera makeDefault position={[2, 3.9, 4.1]} />
        <OrbitControls />
        <Body position={[0, 1, 0]} visibility={visibility} />
        <ContactShadows />
      </Canvas>
    </div>
  );
};

export default Index;