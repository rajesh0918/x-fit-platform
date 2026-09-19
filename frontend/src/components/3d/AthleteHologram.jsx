import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";


/* ==================================================
   HOLOGRAM BODY
================================================== */

function HologramBody() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const time =
      state.clock.elapsedTime;

    groupRef.current.rotation.y =
      Math.sin(time * 0.4) * 0.22;

    groupRef.current.position.y =
      Math.sin(time * 1.1) * 0.06;
  });


  const material =
    new THREE.MeshStandardMaterial({
      color: "#ccff00",

      emissive:
        "#ccff00",

      emissiveIntensity:
        0.55,

      transparent:
        true,

      opacity:
        0.82,

      wireframe:
        true,

      roughness:
        0.3,

      metalness:
        0.15,
    });


  return (
    <group
      ref={groupRef}
      scale={1.18}
    >

      {/* HEAD */}

      <mesh
        position={[
          0,
          2.4,
          0,
        ]}
        material={
          material
        }
      >

        <sphereGeometry
          args={[
            0.32,
            32,
            32,
          ]}
        />

      </mesh>


      {/* NECK */}

      <mesh
        position={[
          0,
          1.95,
          0,
        ]}
        material={
          material
        }
      >

        <cylinderGeometry
          args={[
            0.12,
            0.12,
            0.42,
            20,
          ]}
        />

      </mesh>


      {/* TORSO */}

      <mesh
        position={[
          0,
          1.15,
          0,
        ]}
        scale={[
          0.85,
          1.15,
          0.45,
        ]}
        material={
          material
        }
      >

        <sphereGeometry
          args={[
            0.75,
            32,
            32,
          ]}
        />

      </mesh>


      {/* LEFT ARM */}

      <mesh
        position={[
          -0.9,
          1.2,
          0,
        ]}
        rotation={[
          0,
          0,
          -0.15,
        ]}
        material={
          material
        }
      >

        <capsuleGeometry
          args={[
            0.14,
            1.25,
            8,
            16,
          ]}
        />

      </mesh>


      {/* RIGHT ARM */}

      <mesh
        position={[
          0.9,
          1.2,
          0,
        ]}
        rotation={[
          0,
          0,
          0.15,
        ]}
        material={
          material
        }
      >

        <capsuleGeometry
          args={[
            0.14,
            1.25,
            8,
            16,
          ]}
        />

      </mesh>


      {/* HIPS */}

      <mesh
        position={[
          0,
          0.2,
          0,
        ]}
        scale={[
          0.65,
          0.35,
          0.38,
        ]}
        material={
          material
        }
      >

        <sphereGeometry
          args={[
            0.7,
            32,
            32,
          ]}
        />

      </mesh>


      {/* LEFT LEG */}

      <mesh
        position={[
          -0.35,
          -1.05,
          0,
        ]}
        rotation={[
          0,
          0,
          0.04,
        ]}
        material={
          material
        }
      >

        <capsuleGeometry
          args={[
            0.18,
            1.8,
            8,
            16,
          ]}
        />

      </mesh>


      {/* RIGHT LEG */}

      <mesh
        position={[
          0.35,
          -1.05,
          0,
        ]}
        rotation={[
          0,
          0,
          -0.04,
        ]}
        material={
          material
        }
      >

        <capsuleGeometry
          args={[
            0.18,
            1.8,
            8,
            16,
          ]}
        />

      </mesh>

    </group>
  );
}


/* ==================================================
   BASE ENERGY RING
================================================== */

function EnergyRing() {
  const ringRef =
    useRef();

  useFrame((state) => {
    if (!ringRef.current) {
      return;
    }

    ringRef.current.rotation.z =
      state.clock.elapsedTime *
      0.35;
  });


  return (
    <mesh
      ref={ringRef}
      position={[
        0,
        -2.15,
        0,
      ]}
      rotation={[
        Math.PI / 2,
        0,
        0,
      ]}
    >

      <torusGeometry
        args={[
          1.5,
          0.018,
          16,
          100,
        ]}
      />

      <meshBasicMaterial
        color="#ccff00"
        transparent
        opacity={0.65}
      />

    </mesh>
  );
}


/* ==================================================
   SECOND ENERGY RING
================================================== */

function SecondaryEnergyRing() {
  const ringRef =
    useRef();

  useFrame((state) => {
    if (!ringRef.current) {
      return;
    }

    ringRef.current.rotation.z =
      -state.clock.elapsedTime *
      0.22;
  });


  return (
    <mesh
      ref={ringRef}
      position={[
        0,
        -2.18,
        0,
      ]}
      rotation={[
        Math.PI / 2,
        0,
        0,
      ]}
    >

      <torusGeometry
        args={[
          1.15,
          0.01,
          16,
          100,
        ]}
      />

      <meshBasicMaterial
        color="#00d1ff"
        transparent
        opacity={0.32}
      />

    </mesh>
  );
}


/* ==================================================
   SCAN RING
================================================== */

function ScanRing() {
  const scanRef =
    useRef();

  useFrame((state) => {
    if (!scanRef.current) {
      return;
    }

    const time =
      state.clock.elapsedTime %
      4;


    scanRef.current.position.y =
      -2 + time;


    scanRef.current.material.opacity =
      Math.max(
        0.08,
        0.45 -
          Math.abs(
            time - 2
          ) *
            0.12
      );
  });


  return (
    <mesh
      ref={scanRef}
      position={[
        0,
        -2,
        0,
      ]}
      rotation={[
        Math.PI / 2,
        0,
        0,
      ]}
    >

      <ringGeometry
        args={[
          1.02,
          1.12,
          64,
        ]}
      />

      <meshBasicMaterial
        color="#ccff00"
        transparent
        opacity={0.35}
        side={
          THREE.DoubleSide
        }
      />

    </mesh>
  );
}


/* ==================================================
   CENTRAL CORE
================================================== */

function CoreGlow() {
  return (
    <mesh
      position={[
        0,
        1.1,
        -0.45,
      ]}
    >

      <sphereGeometry
        args={[
          0.55,
          32,
          32,
        ]}
      />

      <meshBasicMaterial
        color="#ccff00"
        transparent
        opacity={0.04}
      />

    </mesh>
  );
}


/* ==================================================
   SCENE
================================================== */

function Scene() {
  return (
    <>

      <ambientLight
        intensity={
          0.5
        }
      />


      <pointLight
        position={[
          3,
          4,
          4,
        ]}
        intensity={
          28
        }
        color="#ccff00"
      />


      <pointLight
        position={[
          -3,
          1,
          2,
        ]}
        intensity={
          16
        }
        color="#00d1ff"
      />


      <pointLight
        position={[
          0,
          -2,
          3,
        ]}
        intensity={
          8
        }
        color="#ccff00"
      />


      <CoreGlow />


      <Float
        speed={1.25}
        rotationIntensity={
          0.1
        }
        floatIntensity={
          0.22
        }
      >

        <HologramBody />

      </Float>


      <EnergyRing />

      <SecondaryEnergyRing />

      <ScanRing />


      <Sparkles
        count={70}
        scale={[
          4.2,
          6,
          4.2,
        ]}
        size={1.8}
        speed={0.35}
        color="#ccff00"
      />


      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.35}
        minPolarAngle={
          Math.PI / 2.6
        }
        maxPolarAngle={
          Math.PI / 1.8
        }
      />

    </>
  );
}


/* ==================================================
   ATHLETE HOLOGRAM
================================================== */

function AthleteHologram() {
  return (
    <div className="relative w-full h-[560px] md:h-[620px]">

      {/* BACK GLOW */}

      <div className="absolute left-1/2 top-[48%] w-[340px] h-[470px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#ccff00]/7 blur-[90px] pointer-events-none" />


      {/* THREE.JS */}

      <Canvas
        camera={{
          position: [
            0,
            0.15,
            6.6,
          ],
          fov: 43,
        }}
        dpr={[
          1,
          1.5,
        ]}
        gl={{
          alpha: true,

          antialias:
            true,

          powerPreference:
            "high-performance",
        }}
        style={{
          background:
            "transparent",
        }}
      >

        <Scene />

      </Canvas>


      {/* FLOOR GLOW */}

      <div className="absolute left-1/2 bottom-[8%] w-[280px] h-[45px] -translate-x-1/2 rounded-[50%] bg-[#ccff00]/10 blur-[25px] pointer-events-none" />

    </div>
  );
}


export default AthleteHologram;