"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

const COBALT = new THREE.Color("#1D3A9E");
const COBALT_SOFT = new THREE.Color("#6F84C9");
const TEA = new THREE.Color("#C8862A");
const KILN = new THREE.Color("#B4362C");
const MILK = new THREE.Color("#EBDDC2");

// A straight RGB blend of cobalt and amber goes through mud; route it through
// milky tea instead so a half-steeped node still reads clearly.
const steep = (out: THREE.Color, from: THREE.Color, t: number) =>
  t < 0.5
    ? out.copy(from).lerp(MILK, t * 2)
    : out.copy(MILK).lerp(TEA, t * 2 - 1);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

type Vec3 = [number, number, number];

interface NodeDef {
  label: (step: number) => string;
  chain: Vec3;
  radius: number;
  tint: (stage: number) => number;
  ring?: { color: THREE.Color; from: number; to: number };
}

// Stage runs 0 (hero) to 6 (end of story). Steps 1-5 match the story panels.
const NODES: NodeDef[] = [
  {
    label: () => "Season: spring",
    chain: [-3.3, 0.85, 0],
    radius: 0.55,
    tint: () => 0,
    ring: { color: KILN, from: 4.9, to: 5.4 },
  },
  {
    label: (step) => (step >= 3 ? "Rainfall: drought" : "Rainfall: heavy"),
    chain: [-1.1, -0.1, 0.3],
    radius: 0.8,
    tint: (s) => smooth(ramp(s, 2.95, 3.5)),
    ring: { color: TEA, from: 2.8, to: 3.3 },
  },
  {
    label: (step) => (step >= 4 ? "Soil: parched" : "Soil: moist"),
    chain: [1.1, 0.35, -0.2],
    radius: 0.68,
    tint: (s) => smooth(ramp(s, 3.9, 4.4)),
  },
  {
    label: (step) => (step >= 4 ? "Harvest: fails" : "Harvest: plentiful"),
    chain: [3.2, -0.4, 0.2],
    radius: 0.6,
    tint: (s) => smooth(ramp(s, 4.2, 4.7)),
  },
];

interface EdgeDef {
  from: number;
  to: number;
  tint: (stage: number) => number;
  // Intervening on a variable severs the arrows pointing into it.
  cut: (stage: number) => number;
}

const EDGES: EdgeDef[] = [
  { from: 0, to: 1, tint: () => 0, cut: (s) => smooth(ramp(s, 2.95, 3.4)) },
  { from: 1, to: 2, tint: (s) => smooth(ramp(s, 3.7, 4.2)), cut: () => 0 },
  { from: 2, to: 3, tint: (s) => smooth(ramp(s, 4.1, 4.6)), cut: () => 0 },
];

// First pour: the cup sweeps its lip from SWEEP_FROM to SWEEP_TO along x,
// filling each variable as the stream passes over it.
const SWEEP_START = 0.42;
const SWEEP_END = 1.0;
const SWEEP_FROM = -3.9;
const SWEEP_TO = 3.9;
const POUR_TILT = 1.62;
const sweepOf = (s: number) => ramp(s, SWEEP_START, SWEEP_END);
const sweepAt = (x: number) => (x - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM);

// Rim point the tea leaves from and the cavity floor, in the cup's tilt frame.
const LIP = new THREE.Vector3(1.0, 0.52, 0);
const FLOOR = new THREE.Vector3(0, -0.29, 0);
const CAVITY_DEPTH = 0.83;
// Kept below the rim so the stencilled surface always has a closed section.
const MAX_FILL = 0.86;

interface Pour {
  lip: THREE.Vector3;
  dir: THREE.Vector3;
  rate: number;
}

interface Body {
  pos: THREE.Vector3;
  r: number;
  impulse: number;
}

interface SceneProps {
  stage: MotionValue<number>;
  step: number;
  reduced: boolean;
}

// Blue-and-white porcelain glaze, laid out along the lathe profile's v axis.
function makeGlaze() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const g = canvas.getContext("2d")!;
  const y = (v: number) => (1 - v) * canvas.height;

  g.fillStyle = "#F8FAFD";
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.fillStyle = g.strokeStyle = "#1D3A9E";

  g.fillRect(0, y(0.545), canvas.width, y(0.52) - y(0.545));
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(0, y(0.505));
  g.lineTo(canvas.width, y(0.505));
  g.stroke();

  g.lineWidth = 6;
  g.beginPath();
  for (let x = 0; x <= canvas.width; x += 4) {
    const yy = y(0.43) + Math.sin((x / canvas.width) * Math.PI * 16) * 16;
    if (x === 0) g.moveTo(x, yy);
    else g.lineTo(x, yy);
  }
  g.stroke();
  for (let k = 0; k < 16; k++) {
    const x = (k + 0.5) * 64;
    g.beginPath();
    g.ellipse(x, y(0.43) + (k % 2 === 0 ? -30 : 30), 12, 7, 0, 0, Math.PI * 2);
    g.fill();
  }

  g.fillRect(0, y(0.23), canvas.width, y(0.16) - y(0.23));
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(0, y(0.66));
  g.lineTo(canvas.width, y(0.66));
  g.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

// Stencil capping: the cavity's clipped back faces increment and its front
// faces decrement the stencil, leaving a non-zero mask exactly where the level
// plane cuts through the cavity. The surface quad is drawn only inside it.
function makeStencilPass(plane: THREE.Plane, side: THREE.Side, op: THREE.StencilOp) {
  return new THREE.MeshBasicMaterial({
    side,
    clippingPlanes: [plane],
    colorWrite: false,
    depthWrite: false,
    depthTest: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilFail: op,
    stencilZFail: op,
    stencilZPass: op,
  });
}

const CUP_PROFILE = [
  [0.001, 0.0],
  [0.42, 0.0],
  [0.45, 0.07],
  [0.4, 0.13],
  [0.56, 0.22],
  [0.78, 0.45],
  [0.94, 0.78],
  [1.02, 1.04],
  [0.99, 1.09],
  [0.93, 1.05],
  [0.86, 0.8],
  [0.7, 0.5],
  [0.48, 0.3],
  [0.001, 0.26],
].map(([x, y]) => new THREE.Vector2(x, y));

const LIQUID_PROFILE = [
  [0.001, 0.275],
  [0.47, 0.31],
  [0.685, 0.505],
  [0.845, 0.8],
  [0.915, 1.045],
].map(([x, y]) => new THREE.Vector2(x, y));

// Handle path in the cup's local frame; both ends sit just inside the sloped
// outer wall so the handle reads as attached.
const HANDLE_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.9, 0.9, 0),
  new THREE.Vector3(-1.2, 0.97, 0),
  new THREE.Vector3(-1.43, 0.82, 0),
  new THREE.Vector3(-1.42, 0.56, 0),
  new THREE.Vector3(-1.18, 0.4, 0),
  new THREE.Vector3(-0.68, 0.36, 0),
]);

const BUBBLES = 44;
const HERO_CUP = new THREE.Vector3(1.7, 0.2, 0);
const POUR_HEIGHT = 2.75;
const STEP3_LIP = new THREE.Vector3(-1.1, 1.75, 0.3);

// Lip offset from the cup centre at the pouring pose, used to aim the lip.
const lipOffset = (tilt: number, scale: number, lean: number) => {
  const x = Math.cos(tilt) * LIP.x + Math.sin(tilt) * LIP.y;
  const y = -Math.sin(tilt) * LIP.x + Math.cos(tilt) * LIP.y;
  return { x: x * scale, y: y * scale * Math.cos(lean) };
};

function Cup({
  stage,
  reduced,
  pour,
}: Omit<SceneProps, "step"> & { pour: React.RefObject<Pour> }) {
  const outer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Mesh>(null);
  const bubbleMesh = useRef<THREE.InstancedMesh>(null);
  const sparkles = useRef<THREE.Object3D>(null);
  const spinAngle = useRef(0);
  const slosh = useRef({ w: 0, v: 0, prevTilt: 0 });

  const glaze = useMemo(() => makeGlaze(), []);
  const body = useMemo(() => new THREE.LatheGeometry(CUP_PROFILE, 72), []);
  const cavity = useMemo(() => new THREE.LatheGeometry(LIQUID_PROFILE, 64), []);
  const handle = useMemo(() => new THREE.TubeGeometry(HANDLE_PATH, 48, 0.068, 14, false), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const stencilBack = useMemo(
    () => makeStencilPass(plane, THREE.BackSide, THREE.IncrementWrapStencilOp),
    [plane]
  );
  const stencilFront = useMemo(
    () => makeStencilPass(plane, THREE.FrontSide, THREE.DecrementWrapStencilOp),
    [plane]
  );
  const surfaceMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: TEA.clone().multiplyScalar(0.82),
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
        stencilWrite: true,
        stencilRef: 0,
        stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp,
        stencilZFail: THREE.ReplaceStencilOp,
        stencilZPass: THREE.ReplaceStencilOp,
      }),
    []
  );
  const bubbleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFF4DC",
        emissive: "#FFE7B8",
        emissiveIntensity: 0.35,
        roughness: 0.2,
        transparent: true,
        opacity: 0.75,
        clippingPlanes: [plane],
      }),
    [plane]
  );
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLES }, () => ({
        a: Math.random() * Math.PI * 2,
        r: Math.random() * 0.62,
        y: 0.3 + Math.random() * 0.7,
        v: 0.08 + Math.random() * 0.16,
        size: 0.006 + Math.random() * 0.01,
      })),
    []
  );
  const tmp = useMemo(
    () => ({
      floor: new THREE.Vector3(),
      point: new THREE.Vector3(),
      world: new THREE.Vector3(),
      up: new THREE.Vector3(),
      upLocal: new THREE.Vector3(),
      rigQuat: new THREE.Quaternion(),
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      e: new THREE.Euler(),
      one: new THREE.Vector3(1, 1, 1),
      zAxis: new THREE.Vector3(0, 0, 1),
    }),
    []
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const s = stage.get();
    const o = outer.current;
    const tg = tilt.current;
    const sg = spin.current;
    const p = pour.current;
    if (!o || !tg || !sg || !p) return;

    let scale: number;
    let tiltAngle: number;
    let lean: number;
    let volume: number;
    let pouring: number;

    if (s < 2) {
      const approach = smooth(ramp(s, 0.05, SWEEP_START));
      const exit = smooth(ramp(s, 1.05, 1.35));
      const sweep = sweepOf(s);
      const lipX = THREE.MathUtils.lerp(SWEEP_FROM, SWEEP_TO, sweep);

      // Tip fully only while the lip is over a variable, like filling four
      // cups in a row; between them the cup eases back and the flow stops.
      let over = 0;
      for (const n of NODES) {
        over = Math.max(over, 1 - smooth(ramp(Math.abs(lipX - n.chain[0]), 0.22, 0.6)));
      }
      tiltAngle =
        smooth(ramp(s, 0.22, SWEEP_START)) *
        THREE.MathUtils.lerp(1.0, POUR_TILT, over) *
        (1 - smooth(ramp(s, 1.0, 1.15)));
      lean = THREE.MathUtils.lerp(0.5, 0.2, approach);
      scale = THREE.MathUtils.lerp(1.45, 0.8, approach) * (1 - exit);

      const off = lipOffset(POUR_TILT, 0.8, 0.2);
      o.position.set(
        THREE.MathUtils.lerp(HERO_CUP.x, lipX - off.x, approach),
        THREE.MathUtils.lerp(HERO_CUP.y, POUR_HEIGHT, approach) + exit * 1.6,
        0
      );
      volume = 1 - 0.85 * smooth(sweep) - 0.15 * smooth(ramp(s, SWEEP_END, 1.12));
      pouring = smooth(ramp(s, 0.2, SWEEP_START));
    } else {
      const enter = smooth(ramp(s, 2.45, 2.8));
      const leave = smooth(ramp(s, 3.55, 3.9));
      scale = 0.5 * enter * (1 - leave);
      tiltAngle =
        smooth(ramp(s, 2.7, 2.95)) * POUR_TILT * (1 - smooth(ramp(s, 3.45, 3.75)) * 0.7);
      lean = 0.2;
      const off = lipOffset(POUR_TILT, 0.5, lean);
      o.position.set(
        STEP3_LIP.x - off.x,
        STEP3_LIP.y - off.y + (1 - enter) * 1.4 + leave * 1.4,
        STEP3_LIP.z
      );
      volume = 1 - smooth(ramp(s, 2.95, 3.5));
      pouring = 1;
    }

    o.visible = scale > 0.002;
    o.scale.setScalar(Math.max(scale, 0.0001));
    o.rotation.set(lean, 0, 0);
    tg.rotation.set(0, 0, -tiltAngle);

    // Idle turn plus a scroll twist; both unwind so the handle faces away from
    // the lip by the time the tea pours.
    if (!reduced) spinAngle.current += delta * 0.35 * (1 - pouring);
    const rest = Math.round(spinAngle.current / (Math.PI * 2)) * Math.PI * 2;
    spinAngle.current = THREE.MathUtils.damp(spinAngle.current, rest, 3 * pouring, delta);
    sg.rotation.y = spinAngle.current + s * 3.2 * (1 - pouring);

    o.updateMatrix();
    tg.updateMatrix();
    p.lip.copy(LIP).applyMatrix4(tg.matrix).applyMatrix4(o.matrix);
    tmp.floor.copy(FLOOR).applyMatrix4(tg.matrix).applyMatrix4(o.matrix);
    p.dir
      .set(1, -0.35, 0)
      .normalize()
      .applyAxisAngle(tmp.zAxis, -tiltAngle)
      .applyEuler(tmp.e.set(lean, 0, 0));

    // The tea surface is held in the cup's own frame, so it tips with the cup
    // and drops toward the floor as the volume drains.
    tmp.upLocal
      .set(0, 1, 0)
      .applyAxisAngle(tmp.zAxis, -tiltAngle)
      .applyEuler(tmp.e.set(lean, 0, 0));
    const depthAlongAxis = volume * MAX_FILL * CAVITY_DEPTH * scale;
    const flowing = volume > 0.03 && tiltAngle > 1.2 && o.visible;
    p.rate = flowing && !reduced ? 380 : 0;

    // Slosh: a damped spring driven by how fast the cup is tipping.
    const sl = slosh.current;
    const tipSpeed = (tiltAngle - sl.prevTilt) / Math.max(delta, 1e-4);
    sl.prevTilt = tiltAngle;
    const target = THREE.MathUtils.clamp(-tipSpeed * 0.08, -0.5, 0.5);
    sl.v += (-(sl.w - target) * 70 - sl.v * 6) * delta;
    sl.w += sl.v * delta;
    if (reduced) sl.w = 0;

    const hasLiquid = volume > 0.02 && o.visible;
    if (liquid.current) liquid.current.visible = hasLiquid;

    const rig = o.parent;
    const cap = surface.current;
    if (rig && cap) {
      cap.visible = hasLiquid;
      tmp.point.copy(tmp.floor).addScaledVector(tmp.upLocal, depthAlongAxis);
      tmp.world.copy(tmp.point);
      rig.localToWorld(tmp.world);

      // Slosh rocks the surface a little around the cup's tilt axis.
      tmp.upLocal
        .set(sl.w, 1, 0)
        .normalize()
        .applyAxisAngle(tmp.zAxis, -tiltAngle)
        .applyEuler(tmp.e.set(lean, 0, 0));
      rig.getWorldQuaternion(tmp.rigQuat);
      tmp.up.copy(tmp.upLocal).applyQuaternion(tmp.rigQuat);
      plane.setFromNormalAndCoplanarPoint(tmp.up.clone().negate(), tmp.world);

      // The surface quad lives in rig space, lying in the clip plane.
      cap.position.copy(tmp.point);
      cap.quaternion.setFromUnitVectors(tmp.zAxis, tmp.upLocal);
      cap.scale.setScalar(Math.max(scale * 2.6, 0.0001));
    }

    const bm = bubbleMesh.current;
    if (bm) {
      bubbles.forEach((b, i) => {
        if (!reduced) {
          b.y += b.v * delta;
          b.a += delta * 0.5;
        }
        if (b.y > 1.02) {
          b.y = 0.3;
          b.r = Math.random() * 0.62;
        }
        const reach = Math.min(b.r, 0.2 + (b.y - 0.3) * 0.9);
        tmp.point.set(Math.cos(b.a) * reach, b.y, Math.sin(b.a) * reach);
        tmp.m.compose(tmp.point, tmp.q, tmp.one.setScalar(b.size));
        bm.setMatrixAt(i, tmp.m);
      });
      bm.instanceMatrix.needsUpdate = true;
    }

    if (sparkles.current) sparkles.current.visible = s < 0.3 && !reduced;
  });

  return (
    <>
      <group ref={outer}>
        <group ref={tilt}>
          <group ref={spin}>
            <group position={[0, -0.55, 0]}>
              <mesh geometry={body}>
                <meshPhysicalMaterial
                  map={glaze}
                  side={THREE.DoubleSide}
                  roughness={0.22}
                  clearcoat={1}
                  clearcoatRoughness={0.08}
                  envMapIntensity={1.1}
                />
              </mesh>
              <mesh geometry={handle}>
                <meshPhysicalMaterial
                  color="#F8FAFD"
                  roughness={0.22}
                  clearcoat={1}
                  clearcoatRoughness={0.08}
                />
              </mesh>
              <group ref={liquid}>
                <mesh geometry={cavity} material={stencilBack} renderOrder={1} />
                <mesh geometry={cavity} material={stencilFront} renderOrder={1} />
                <instancedMesh
                  ref={bubbleMesh}
                  args={[undefined, bubbleMaterial, BUBBLES]}
                  frustumCulled={false}
                  renderOrder={3}
                >
                  <sphereGeometry args={[1, 8, 6]} />
                </instancedMesh>
              </group>
            </group>
          </group>
        </group>
        <Sparkles
          ref={sparkles as any}
          count={24}
          scale={[1.4, 0.8, 1.4]}
          position={[0, 0.95, 0]}
          size={2.5}
          speed={0.5}
          noise={0.4}
          color="#FFE2A6"
        />
      </group>
      <mesh ref={surface} material={surfaceMaterial} renderOrder={2} visible={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}

const MAX_DROPS = 1000;
const GRAVITY = 11;
const LIQUID = 0;
const FIZZ = 1;
const SPLASH = 2;
// Liquid that breaks away from the main rope and falls as separate droplets.
const LOOSE = 3;
const SPINE = 260;
const RADIAL = 10;

function Stream({
  pour,
  bodies,
}: {
  pour: React.RefObject<Pour>;
  bodies: React.RefObject<Body[]>;
}) {
  const dropMesh = useRef<THREE.InstancedMesh>(null);
  const fizzMesh = useRef<THREE.InstancedMesh>(null);
  const sim = useMemo(
    () => ({
      pos: new Float32Array(MAX_DROPS * 3),
      vel: new Float32Array(MAX_DROPS * 3),
      life: new Float32Array(MAX_DROPS),
      size: new Float32Array(MAX_DROPS),
      kind: new Uint8Array(MAX_DROPS),
      inRope: new Uint8Array(MAX_DROPS),
      next: 0,
      carry: 0,
      prevLip: new THREE.Vector3(),
      primed: false,
      time: 0,
    }),
    []
  );

  // The rope: a tube rebuilt every frame through the live drops in emission
  // order, so its shape comes straight from the particle physics.
  const rope = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(new Float32Array(SPINE * RADIAL * 3), 3);
    const normal = new THREE.BufferAttribute(new Float32Array(SPINE * RADIAL * 3), 3);
    position.setUsage(THREE.DynamicDrawUsage);
    normal.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", position);
    geometry.setAttribute("normal", normal);
    const index = new THREE.BufferAttribute(new Uint16Array(SPINE * RADIAL * 6), 1);
    index.setUsage(THREE.DynamicDrawUsage);
    geometry.setIndex(index);
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);
    return {
      geometry,
      position,
      normal,
      index,
      px: new Float32Array(SPINE),
      py: new Float32Array(SPINE),
      pz: new Float32Array(SPINE),
      pr: new Float32Array(SPINE),
      seg: new Int32Array(SPINE),
      members: new Int32Array(SPINE * 8),
    };
  }, []);

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      p: new THREE.Vector3(),
      v: new THREE.Vector3(),
      s: new THREE.Vector3(),
      t: new THREE.Vector3(),
      n: new THREE.Vector3(),
      b: new THREE.Vector3(),
      ref: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      lipVel: new THREE.Vector3(),
    }),
    []
  );

  // `age` advances a drop born partway through the frame, so drops emitted
  // in one frame spread along the stream instead of travelling as a clump.
  const spawn = (
    x: number, y: number, z: number,
    vx: number, vy: number, vz: number,
    kind: number, size: number, life: number, age = 0
  ) => {
    const i = sim.next;
    sim.next = (sim.next + 1) % MAX_DROPS;
    const g = GRAVITY * (kind === FIZZ ? 0.85 : 1);
    sim.pos.set(
      [x + vx * age, y + vy * age - 0.5 * g * age * age, z + vz * age],
      i * 3
    );
    sim.vel.set([vx, vy - g * age, vz], i * 3);
    sim.kind[i] = kind;
    sim.size[i] = size;
    sim.life[i] = life - age;
  };

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30);
    sim.time += dt;
    const p = pour.current;
    const dm = dropMesh.current;
    const fm = fizzMesh.current;
    if (!p || !dm || !fm) return;

    // A jump (fast scroll, or the cup reappearing elsewhere) would otherwise
    // smear drops along the gap between the old and new lip positions.
    if (!sim.primed || sim.prevLip.distanceTo(p.lip) > 0.25) {
      sim.prevLip.copy(p.lip);
      sim.primed = true;
    }
    // Low-pass the lip's velocity: stepwise scrolling otherwise kicks the
    // stream sideways in jerks and kinks the rope.
    tmp.v.subVectors(p.lip, sim.prevLip).divideScalar(Math.max(dt, 1e-4)).clampLength(0, 3);
    tmp.lipVel.lerp(tmp.v, 1 - Math.exp(-dt * 4));

    if (p.rate > 0) {
      sim.carry += p.rate * dt;
      const n = Math.floor(sim.carry);
      sim.carry -= n;
      // A slow lateral waver so the falling rope isn't ruler-straight.
      const waver = Math.sin(sim.time * 3.1) * 0.018 + Math.sin(sim.time * 7.3) * 0.008;
      for (let k = 0; k < n; k++) {
        const f = (k + Math.random()) / n;
        const x = THREE.MathUtils.lerp(sim.prevLip.x, p.lip.x, f) + (Math.random() - 0.5) * 0.02;
        const y = THREE.MathUtils.lerp(sim.prevLip.y, p.lip.y, f);
        const z = THREE.MathUtils.lerp(sim.prevLip.z, p.lip.z, f) + (Math.random() - 0.5) * 0.02;
        const speed = 0.75 + Math.random() * 0.1;
        const roll = Math.random();
        const kind = roll < 0.08 ? FIZZ : roll < 0.2 ? LOOSE : LIQUID;
        // Loose drops get a sideways kick so they peel away from the rope.
        const kick = kind === LOOSE ? 0.35 : 0;
        spawn(
          x, y, z,
          p.dir.x * speed + tmp.lipVel.x * 0.15 + waver + (Math.random() - 0.5) * kick,
          p.dir.y * speed + tmp.lipVel.y * 0.15,
          p.dir.z * speed + waver * 0.5 + (Math.random() - 0.5) * kick,
          kind,
          kind === FIZZ
            ? 0.012 + Math.random() * 0.01
            : kind === LOOSE
              ? 0.022 + Math.random() * 0.03
              : 0.03 + Math.random() * 0.015,
          3,
          (1 - f) * dt
        );
      }
    } else {
      sim.carry = 0;
    }
    sim.prevLip.copy(p.lip);

    const list = bodies.current ?? [];

    for (let i = 0; i < MAX_DROPS; i++) {
      if (sim.life[i] <= 0) continue;
      const kind = sim.kind[i];
      const o = i * 3;
      sim.vel[o + 1] -= GRAVITY * (kind === FIZZ ? 0.85 : 1) * dt;
      sim.pos[o] += sim.vel[o] * dt;
      sim.pos[o + 1] += sim.vel[o + 1] * dt;
      sim.pos[o + 2] += sim.vel[o + 2] * dt;
      sim.life[i] -= dt;
      tmp.p.set(sim.pos[o], sim.pos[o + 1], sim.pos[o + 2]);

      if (tmp.p.y < -2) {
        sim.life[i] = 0;
        continue;
      }

      // Drops that reach a variable are absorbed into it; a few splash back.
      if (kind !== SPLASH) {
        for (const b of list) {
          if (b.r < 0.08) continue;
          if (tmp.p.distanceToSquared(b.pos) < b.r * b.r) {
            sim.life[i] = 0;
            b.impulse = Math.min(b.impulse + 0.006, 0.14);
            if ((kind === LIQUID || kind === LOOSE) && Math.random() < 0.16) {
              tmp.v.subVectors(tmp.p, b.pos).normalize();
              for (let k = 0; k < 3; k++) {
                spawn(
                  tmp.p.x, tmp.p.y, tmp.p.z,
                  tmp.v.x * 1.3 + (Math.random() - 0.5) * 1.1,
                  Math.abs(tmp.v.y) * 1.1 + 1.1 + Math.random(),
                  tmp.v.z * 1.3 + (Math.random() - 0.5) * 1.1,
                  SPLASH,
                  0.014 + Math.random() * 0.016,
                  0.5
                );
              }
            }
            break;
          }
        }
      }
    }

    // Walk liquid drops newest to oldest, sampling a spine every ~3.5cm and
    // starting a new segment wherever the stream has broken apart.
    sim.inRope.fill(0);
    let count = 0;
    let seg = 0;
    let lastX = 0, lastY = 0, lastZ = 0;
    let open = false;
    let segStart = 0;
    const closeSegment = () => {
      // Too short to read as a stream: leave those drops as droplets.
      if (count - segStart < 3) {
        for (let k = segStart; k < count; k++) {
          for (let j = 0; j < 8; j++) {
            const idx = rope.members[k * 8 + j];
            if (idx >= 0) sim.inRope[idx] = 0;
          }
        }
        count = segStart;
      } else {
        seg++;
      }
      open = false;
    };
    for (let k = 0; k < MAX_DROPS && count < SPINE; k++) {
      const i = (sim.next - 1 - k + MAX_DROPS) % MAX_DROPS;
      if (sim.kind[i] !== LIQUID) continue;
      const o = i * 3;
      if (sim.life[i] <= 0) {
        if (open) closeSegment();
        continue;
      }
      const x = sim.pos[o], y = sim.pos[o + 1], z = sim.pos[o + 2];
      const d2 = (x - lastX) ** 2 + (y - lastY) ** 2 + (z - lastZ) ** 2;
      if (open && d2 > 0.3 * 0.3) closeSegment();
      if (!open || d2 > 0.035 * 0.035) {
        if (!open) {
          open = true;
          segStart = count;
        }
        const speed = Math.hypot(sim.vel[o], sim.vel[o + 1], sim.vel[o + 2]);
        rope.px[count] = x;
        rope.py[count] = y;
        rope.pz[count] = z;
        // Continuity: a stream narrows as it accelerates.
        rope.pr[count] = 0.085 / Math.sqrt(1 + 0.45 * speed);
        rope.seg[count] = seg;
        rope.members.fill(-1, count * 8, count * 8 + 8);
        rope.members[count * 8] = i;
        count++;
        lastX = x; lastY = y; lastZ = z;
      } else {
        const slot = count - 1;
        for (let j = 1; j < 8; j++) {
          if (rope.members[slot * 8 + j] < 0) {
            rope.members[slot * 8 + j] = i;
            break;
          }
        }
      }
      sim.inRope[i] = 1;
    }
    if (open) closeSegment();

    // Two passes of neighbour averaging smooth out per-frame emission jitter
    // while keeping each segment's ends pinned (lip and impact point).
    for (let pass = 0; pass < 2; pass++) {
      for (let k = 1; k < count - 1; k++) {
        if (rope.seg[k - 1] !== rope.seg[k] || rope.seg[k + 1] !== rope.seg[k]) continue;
        rope.px[k] = (rope.px[k - 1] + rope.px[k] * 2 + rope.px[k + 1]) / 4;
        rope.py[k] = (rope.py[k - 1] + rope.py[k] * 2 + rope.py[k + 1]) / 4;
        rope.pz[k] = (rope.pz[k - 1] + rope.pz[k] * 2 + rope.pz[k + 1]) / 4;
      }
    }

    const pos = rope.position.array as Float32Array;
    const nor = rope.normal.array as Float32Array;
    const idx = rope.index.array as Uint16Array;
    let tri = 0;
    for (let k = 0; k < count; k++) {
      const prev = k > 0 && rope.seg[k - 1] === rope.seg[k] ? k - 1 : k;
      const next = k < count - 1 && rope.seg[k + 1] === rope.seg[k] ? k + 1 : k;
      tmp.t.set(
        rope.px[next] - rope.px[prev],
        rope.py[next] - rope.py[prev],
        rope.pz[next] - rope.pz[prev]
      );
      if (tmp.t.lengthSq() < 1e-8) tmp.t.set(0, -1, 0);
      tmp.t.normalize();
      tmp.ref.set(0, 0, 1);
      if (Math.abs(tmp.t.dot(tmp.ref)) > 0.9) tmp.ref.set(1, 0, 0);
      tmp.n.crossVectors(tmp.t, tmp.ref).normalize();
      tmp.b.crossVectors(tmp.t, tmp.n);

      // Taper the far end so the stream finishes in a point, not a stump.
      let fromEnd = 0;
      while (k + fromEnd + 1 < count && rope.seg[k + fromEnd + 1] === rope.seg[k] && fromEnd < 3) fromEnd++;
      const r = rope.pr[k] * (0.35 + 0.65 * (fromEnd / 3));

      for (let a = 0; a < RADIAL; a++) {
        const ang = (a / RADIAL) * Math.PI * 2;
        const c = Math.cos(ang), s = Math.sin(ang);
        const nx = tmp.n.x * c + tmp.b.x * s;
        const ny = tmp.n.y * c + tmp.b.y * s;
        const nz = tmp.n.z * c + tmp.b.z * s;
        const v = (k * RADIAL + a) * 3;
        pos[v] = rope.px[k] + nx * r;
        pos[v + 1] = rope.py[k] + ny * r;
        pos[v + 2] = rope.pz[k] + nz * r;
        nor[v] = nx;
        nor[v + 1] = ny;
        nor[v + 2] = nz;
      }

      if (next !== k) {
        for (let a = 0; a < RADIAL; a++) {
          const a2 = (a + 1) % RADIAL;
          const i0 = k * RADIAL + a;
          const i1 = k * RADIAL + a2;
          const i2 = next * RADIAL + a;
          const i3 = next * RADIAL + a2;
          idx[tri++] = i0; idx[tri++] = i1; idx[tri++] = i2;
          idx[tri++] = i1; idx[tri++] = i3; idx[tri++] = i2;
        }
      }
    }
    rope.geometry.setDrawRange(0, tri);
    rope.position.needsUpdate = true;
    rope.normal.needsUpdate = true;
    rope.index.needsUpdate = true;

    let dropCount = 0;
    let fizzCount = 0;
    for (let i = 0; i < MAX_DROPS; i++) {
      if (sim.life[i] <= 0 || sim.inRope[i]) continue;
      const kind = sim.kind[i];
      const o = i * 3;
      tmp.p.set(sim.pos[o], sim.pos[o + 1], sim.pos[o + 2]);
      tmp.v.set(sim.vel[o], sim.vel[o + 1], sim.vel[o + 2]);
      const speed = tmp.v.length();
      if (speed > 1e-4) tmp.q.setFromUnitVectors(tmp.up, tmp.v.divideScalar(speed));
      const r = sim.size[i];
      const stretch = kind === FIZZ ? 1 : 1 + Math.min(speed * 0.2, 1.2);
      tmp.s.set(r, r * stretch, r);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      if (kind === FIZZ) fm.setMatrixAt(fizzCount++, tmp.m);
      else dm.setMatrixAt(dropCount++, tmp.m);
    }
    dm.count = dropCount;
    fm.count = fizzCount;
    dm.instanceMatrix.needsUpdate = true;
    fm.instanceMatrix.needsUpdate = true;
  });

  const liquidLook = {
    color: TEA,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.7,
  };

  return (
    <>
      <mesh geometry={rope.geometry} frustumCulled={false}>
        <meshPhysicalMaterial {...liquidLook} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={dropMesh} args={[undefined, undefined, MAX_DROPS]} count={0} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshPhysicalMaterial {...liquidLook} />
      </instancedMesh>
      <instancedMesh ref={fizzMesh} args={[undefined, undefined, MAX_DROPS]} count={0} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial
          color="#FFF6E2"
          emissive="#FFE3A6"
          emissiveIntensity={1}
          transparent
          opacity={0.85}
        />
      </instancedMesh>
    </>
  );
}

function Blob({
  def,
  index,
  stage,
  reduced,
  labels,
  bodies,
}: Omit<SceneProps, "step"> & {
  def: NodeDef;
  index: number;
  labels: React.RefObject<(HTMLDivElement | null)[]>;
  bodies: React.RefObject<Body[]>;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<any>(null);
  const ring = useRef<THREE.Mesh>(null);
  const chain = useMemo(() => new THREE.Vector3(...def.chain), [def]);
  const anchor = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const s = stage.get();
    const t = state.clock.elapsedTime;
    const g = group.current;
    const body = bodies.current?.[index];
    if (!g || !material.current || !body) return;

    // The variable swells from the tea landing on it as the stream passes.
    const at = sweepAt(def.chain[0]);
    const sweep = sweepOf(s);
    const grow = s > SWEEP_END + 0.05 ? 1 : smooth(ramp(sweep, at - 0.05, at + 0.05));

    g.position.copy(chain);
    if (!reduced) g.position.y += Math.sin(t * 0.7 + index * 1.9) * 0.05 * grow;
    g.visible = grow > 0.001;
    const r = def.radius * grow;
    g.scale.setScalar(Math.max(r, 0.0001));
    body.pos.copy(g.position);
    // Catch the first drops while the pool is still tiny.
    body.r = grow > 0.001 ? def.radius * Math.max(grow, 0.45) : 0;
    body.impulse *= Math.exp(-delta * 3);

    // The poured tea cools to cobalt once the whole pour is done;
    // intervention re-steeps it later.
    const cooling = 1 - smooth(ramp(s, SWEEP_END, SWEEP_END + 0.25));
    const tint = Math.max(cooling, def.tint(s));
    steep(material.current.color, COBALT, tint);
    // Past ~0.45 the distorted normals start rendering dark rims.
    material.current.distort = Math.min(
      0.24 + (1 - grow) * 0.2 + Math.sin(def.tint(s) * Math.PI) * 0.15 + body.impulse,
      0.45
    );

    if (ring.current && def.ring) {
      const on = smooth(ramp(s, def.ring.from, def.ring.to));
      ring.current.scale.setScalar(1.35 + (1 - on) * 0.5);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = on * 0.9;
      ring.current.rotation.z = t * 0.4;
    }

    const label = labels.current?.[index];
    if (label) {
      // Alternate labels above and below so neighbours never collide.
      anchor.set(0, index % 2 === 0 ? 1.5 : -1.55, 0);
      g.localToWorld(anchor).project(state.camera);
      const x = ((anchor.x + 1) / 2) * state.size.width;
      const y = ((1 - anchor.y) / 2) * state.size.height;
      label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      label.style.opacity = String(ramp(s, 1.05, 1.35));
    }
  });

  return (
    <group ref={group} visible={false}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <MeshDistortMaterial
          ref={material}
          color={TEA}
          speed={reduced ? 0 : 1.8}
          distort={0.3}
          roughness={0.12}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.3}
        />
      </mesh>
      {def.ring && (
        <mesh ref={ring}>
          <torusGeometry args={[1, 0.025, 12, 96]} />
          <meshBasicMaterial color={def.ring.color} transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

function Edge({
  def,
  index,
  stage,
  reduced,
}: Omit<SceneProps, "step"> & { def: EdgeDef; index: number }) {
  const tube = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...NODES[def.from].chain);
    const b = new THREE.Vector3(...NODES[def.to].chain);
    const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, 0.45, 0.2));
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [def]);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 64, 0.03, 10, false),
    [curve]
  );
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const s = stage.get();
    const appear = smooth(ramp(s, 1.0, 1.35));
    const cut = def.cut(s);
    const tint = def.tint(s);

    if (tube.current) {
      const m = tube.current.material as THREE.MeshStandardMaterial;
      m.opacity = appear * (1 - cut * 0.85) * 0.85;
      steep(m.color, COBALT_SOFT, tint);
    }

    if (pulse.current) {
      const speed = reduced ? 0 : 0.32;
      const t = (state.clock.elapsedTime * speed + index * 0.33) % 1;
      curve.getPoint(t, point);
      pulse.current.position.copy(point);
      const m = pulse.current.material as THREE.MeshBasicMaterial;
      m.opacity = appear * (1 - cut) * (reduced ? 0 : 1);
      steep(m.color, COBALT, tint);
    }
  });

  return (
    <group>
      <mesh ref={tube} geometry={geometry}>
        <meshStandardMaterial
          color={COBALT_SOFT}
          transparent
          opacity={0}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color={COBALT} transparent opacity={0} />
      </mesh>
    </group>
  );
}

function Rig({
  stage,
  pointer,
  children,
}: {
  stage: MotionValue<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const s = stage.get();
    const settle = smooth(ramp(s, 0.1, 1.1));
    const narrow = viewport.width < viewport.height * 1.1;

    let x: number;
    let y: number;
    let scale: number;
    if (narrow) {
      scale = viewport.width / (7.5 + settle * 2.8);
      x = THREE.MathUtils.lerp(-1.1 * scale, 0, settle);
      y = THREE.MathUtils.lerp(0.4, viewport.height * 0.2, settle);
    } else {
      scale = Math.min(1, viewport.width / (11 + settle * 3));
      x = THREE.MathUtils.lerp(viewport.width * 0.1, viewport.width * 0.19, settle);
      y = 0.1;
    }

    const damp = THREE.MathUtils.damp;
    g.position.x = damp(g.position.x, x, 4, delta);
    g.position.y = damp(g.position.y, y, 4, delta);
    g.scale.setScalar(damp(g.scale.x, scale, 4, delta));

    const p = pointer.current ?? { x: 0, y: 0 };
    g.rotation.y = damp(g.rotation.y, p.x * 0.22, 3, delta);
    g.rotation.x = damp(g.rotation.x, -p.y * 0.12, 3, delta);
  });

  return <group ref={ref}>{children}</group>;
}

export default function CausalScene({
  stage,
  step,
  reduced,
  active,
}: SceneProps & { active: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const pour = useRef<Pour>({
    lip: new THREE.Vector3(),
    dir: new THREE.Vector3(0, -1, 0),
    rate: 0,
  });
  const bodies = useRef<Body[]>(
    NODES.map(() => ({ pos: new THREE.Vector3(), r: 0, impulse: 0 }))
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{ antialias: true, alpha: true, stencil: true }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
        }}
      >
        <hemisphereLight args={["#FFFFFF", "#AEBBD6", 1.1]} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />
        <directionalLight position={[-6, -3, 2]} intensity={0.6} color="#F4E6CF" />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 6, 3]} scale={[14, 4, 1]} />
          <Lightformer form="rect" intensity={0.8} position={[0, -6, 2]} scale={[14, 3, 1]} color="#F4E6CF" />
          <Lightformer form="circle" intensity={3} position={[5, 3, 4]} scale={1.2} />
        </Environment>

        <Rig stage={stage} pointer={pointer}>
          <Cup stage={stage} reduced={reduced} pour={pour} />
          {EDGES.map((def, i) => (
            <Edge key={i} def={def} index={i} stage={stage} reduced={reduced} />
          ))}
          {NODES.map((def, i) => (
            <Blob
              key={i}
              def={def}
              index={i}
              stage={stage}
              reduced={reduced}
              labels={labels}
              bodies={bodies}
            />
          ))}
          <Stream pour={pour} bodies={bodies} />
        </Rig>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {NODES.map((def, i) => (
          <div
            key={i}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-white/85 px-3 py-1 text-[13px] font-semibold text-ink shadow-sm"
            style={{ opacity: 0 }}
          >
            {def.label(step)}
          </div>
        ))}
      </div>
    </div>
  );
}
