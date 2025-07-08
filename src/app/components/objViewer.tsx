"use client";

import { useRef } from "react";
import { Canvas,useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { Mesh } from "three";


type MeshComponentProps = {
    url: string;
}

type ObjViewerProps = {
    url: string;

}

function MeshComponent({url} :MeshComponentProps) {

  const mesh = useRef<Mesh>(null!);
  const obj = useLoader(OBJLoader, url);

  useFrame(() => {
    mesh.current.rotation.y -= 0.01;
  });

  return (
    <mesh ref={mesh}>
      <primitive object={obj} />
    </mesh>
  );
}

export default function ObjViewer({url}:ObjViewerProps) {
  return (
     <Canvas
      className="h-full w-full"
      camera={{ position: [0, 2, 200], fov: 90 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
        <MeshComponent url={url}/>
      <OrbitControls />
    </Canvas>
  );
}
