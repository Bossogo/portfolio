"use client";

import { Float, PerspectiveCamera, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";

export type GlobeTarget = {
  x: number;
  y: number;
  radius: number;
};

type SceneLayerProps = {
  reducedMotion: boolean;
  allowed: boolean;
  onGlobeTargetChange?: (target: GlobeTarget) => void;
};

const codeFragments = [
  "const idea = buildSomethingNew();",
  "if (cursor.distance < threshold) applyRepel();",
  "phase = interactions >= target ? 'allowed' : 'resisting';",
  "velocity = damp(velocity, 0.82);",
  "renderCreativeMotion(scene, userInput);",
  "export const craft = 'creation';",
];

function RingCluster({ reducedMotion, allowed }: SceneLayerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const spin = allowed ? 0.32 : 0.24;
    const tilt = allowed ? 0.11 : 0.06;

    groupRef.current.rotation.y += delta * spin;
    groupRef.current.rotation.x += delta * tilt;
    groupRef.current.rotation.z = Math.sin(performance.now() * 0.00018) * (allowed ? 0.07 : 0.12);
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[0.35, 0.2, 0]}>
        <torusGeometry args={[1.05, 0.018, 12, 92]} />
        <meshStandardMaterial
          color="#5cc7ff"
          emissive="#1c8bff"
          emissiveIntensity={allowed ? 1.05 : 0.8}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[1.4, 0.85, 0.25]}>
        <torusGeometry args={[0.75, 0.02, 10, 74]} />
        <meshStandardMaterial
          color="#8eb0ff"
          emissive="#3a6eff"
          emissiveIntensity={allowed ? 0.9 : 0.7}
          metalness={0.65}
          roughness={0.18}
        />
      </mesh>
      <mesh rotation={[0.8, 2, 1]}>
        <torusGeometry args={[0.5, 0.012, 8, 54]} />
        <meshStandardMaterial
          color="#8ef8dd"
          emissive="#1eb890"
          emissiveIntensity={allowed ? 0.8 : 0.55}
          metalness={0.58}
          roughness={0.3}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#d5ecff"
          emissive="#69d9ff"
          emissiveIntensity={allowed ? 1.3 : 1}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function CodeBands({ reducedMotion, allowed }: SceneLayerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) {
      return;
    }

    const velocity = allowed ? 0.22 : 0.12;
    const sway = allowed ? 0.08 : 0.12;

    groupRef.current.rotation.y += delta * velocity;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.24) * sway;
  });

  return (
    <group ref={groupRef}>
      {[0, 1].map((band) => {
        const radius = 1.35 - band * 0.2;
        const y = 0.24 - band * 0.22;
        const tilt = 0.4 + band * 0.18;

        return (
          <group key={band} position={[0, y, 0]} rotation={[tilt, band * 0.72, band * 0.4]}>
            {codeFragments.map((fragment, index) => {
              const angle = (index / codeFragments.length) * Math.PI * 2;

              return (
                <Text
                  key={`${band}-${fragment}`}
                  position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
                  rotation={[0, -angle + Math.PI / 2, 0]}
                  fontSize={0.072}
                  color={allowed ? "#b2ecff" : band % 2 === 0 ? "#8fd5ff" : "#79f8df"}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.7}
                >
                  {fragment}
                </Text>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

type GlobeTrackerProps = {
  globeGroupRef: RefObject<THREE.Group | null>;
  onGlobeTargetChange?: (target: GlobeTarget) => void;
};

function GlobeTracker({ globeGroupRef, onGlobeTargetChange }: GlobeTrackerProps) {
  const { camera, size, gl } = useThree();
  const centerRef = useRef(new THREE.Vector3());
  const projectedRef = useRef(new THREE.Vector3());
  const cameraSpaceRef = useRef(new THREE.Vector3());
  const lastTargetRef = useRef<GlobeTarget | null>(null);
  const lastEmitAtRef = useRef(0);

  useFrame((state) => {
    if (!globeGroupRef.current || !onGlobeTargetChange) {
      return;
    }

    const center = centerRef.current;
    globeGroupRef.current.getWorldPosition(center);

    const projected = projectedRef.current.copy(center).project(camera);
    const localX = (projected.x * 0.5 + 0.5) * size.width;
    const localY = (-projected.y * 0.5 + 0.5) * size.height;
    const canvasRect = gl.domElement.getBoundingClientRect();
    const x = canvasRect.left + localX;
    const y = canvasRect.top + localY;

    // Approximate visible globe radius in pixels from world-space radius and camera depth.
    let radius = 70;
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const cameraSpace = cameraSpaceRef.current.copy(center).applyMatrix4(camera.matrixWorldInverse);
      const depth = Math.max(Math.abs(cameraSpace.z), 0.001);
      const worldRadius = 1.08;
      const fovRadians = THREE.MathUtils.degToRad(perspectiveCamera.fov);
      radius = (worldRadius / depth) * (size.height / (2 * Math.tan(fovRadians / 2)));
    }

    const nextTarget: GlobeTarget = {
      x,
      y,
      radius: Math.min(Math.max(radius, 44), 170),
    };

    const lastTarget = lastTargetRef.current;
    const elapsedMs = state.clock.elapsedTime * 1000 - lastEmitAtRef.current;
    if (lastTarget) {
      const dx = Math.abs(nextTarget.x - lastTarget.x);
      const dy = Math.abs(nextTarget.y - lastTarget.y);
      const dr = Math.abs(nextTarget.radius - lastTarget.radius);
      const insignificantChange = dx < 0.35 && dy < 0.35 && dr < 0.2;
      if (insignificantChange || elapsedMs < 25) {
        return;
      }
    }

    lastTargetRef.current = nextTarget;
    lastEmitAtRef.current = state.clock.elapsedTime * 1000;
    onGlobeTargetChange(nextTarget);
  });

  return null;
}

export function SceneLayer({ reducedMotion, allowed, onGlobeTargetChange }: SceneLayerProps) {
  const globeGroupRef = useRef<THREE.Group>(null);

  return (
    <div aria-hidden className="scene-layer">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault fov={46} position={[0, 0, 5.8]} />
        <ambientLight intensity={allowed ? 0.4 : 0.34} />
        <pointLight position={[2.6, 1.8, 3]} intensity={2.6} color="#78c7ff" />
        <pointLight
          position={[-2.3, -1.3, 2.5]}
          intensity={allowed ? 2.2 : 1.8}
          color={allowed ? "#82ffe6" : "#4cf3cf"}
        />
        {!reducedMotion && (
          <Stars radius={52} depth={18} count={420} factor={1.9} saturation={0} fade speed={0.12} />
        )}
        <Float
          speed={reducedMotion ? 0 : allowed ? 1.6 : 1.2}
          rotationIntensity={reducedMotion ? 0 : allowed ? 0.4 : 0.3}
          floatIntensity={reducedMotion ? 0 : allowed ? 1 : 0.7}
        >
          <group ref={globeGroupRef} position={[0, -0.48, 0]}>
            <RingCluster reducedMotion={reducedMotion} allowed={allowed} />
            <CodeBands reducedMotion={reducedMotion} allowed={allowed} />
          </group>
          <GlobeTracker globeGroupRef={globeGroupRef} onGlobeTargetChange={onGlobeTargetChange} />
        </Float>
      </Canvas>
    </div>
  );
}