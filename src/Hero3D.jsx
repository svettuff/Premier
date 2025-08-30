import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import modelUrl from "./assets/grill_food.glb?url";

const CAMERA = { position: [0, 0, 14], fov: 50 };

const LIGHTS = {
    ambient: 1,
    dirPos: [6, 8, 10],
    dirInt: 2,
    pointPos: [-6, -4, 8],
    pointInt: 1.5,
    pointColor: "#ffb899",
};

const ITEMS = [
    { wantName: "bratwurst_1",       position: [-5,  2, -2], scale: 10, rotSpeed: 0.6 },
    { wantName: "beef_ribeye_1",     position: [-3, -3, -2], scale: 10, rotSpeed: 0.3 },
    { wantName: "burger_patty_1",    position: [ 5,  3, -3], scale: 10, rotSpeed: 0.8 },
    { wantName: "raw_bratwurst_2",   position: [ 4, -2, -1], scale: 10, rotSpeed: 0.5 },
    { wantName: "raw_beef_ribeye_2", position: [ 0,  4, -2], scale: 10, rotSpeed: 0.4 },
];

function FloatingItem({ part, position, scale = 6, rotSpeed = 0.4 }) {
    const group = useRef();
    useFrame(({ clock }) => {
        if (!group.current) return;
        const t = clock.getElapsedTime();
        group.current.rotation.y = t * rotSpeed;
        group.current.rotation.x = Math.sin(t * rotSpeed * 0.5) * 0.3;
        group.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.4;
    });
    if (!part) return null;
    return (
        <group ref={group} position={position}>
            <primitive object={part} scale={scale} />
        </group>
    );
}

function ItemsField() {
    const gltf = useGLTF(modelUrl);
    const prepared = useMemo(() => {
        const pick = (name) => {
            let mesh = null;
            gltf.scene.traverse(o => {
                if (!mesh && o.isMesh && (o.name === name || o.name.includes(name))) mesh = o.clone(true);
            });
            return mesh;
        };
        return ITEMS.map(cfg => ({ ...cfg, part: pick(cfg.wantName) }));
    }, [gltf]);

    return prepared.map((it, i) => (
        <FloatingItem key={i} part={it.part} position={it.position} scale={it.scale} rotSpeed={it.rotSpeed} />
    ));
}

useGLTF.preload(modelUrl);

export default function Hero3D() {
    return (
        <Canvas
            style={{ position: "absolute", inset: 0, height: "100%", zIndex: 0, pointerEvents: "none" }}
            camera={CAMERA}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
        >
            <ambientLight intensity={LIGHTS.ambient} />
            <directionalLight position={LIGHTS.dirPos} intensity={LIGHTS.dirInt} />
            <pointLight position={LIGHTS.pointPos} intensity={LIGHTS.pointInt} color={LIGHTS.pointColor} />

            <Suspense fallback={null}>
                <ItemsField />
            </Suspense>
        </Canvas>
    );
}
