"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { Hero } from "@/components/Landing/Hero";
import { Story } from "@/components/Landing/Story";
import { Lab } from "@/components/Landing/Lab";

const CausalScene = dynamic(() => import("@/components/Scene/CausalScene"), {
  ssr: false,
});

export default function Home() {
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const labRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: labProgress } = useScroll({
    target: labRef,
    offset: ["start end", "start start"],
  });

  const stage = useTransform(
    [heroProgress, storyProgress],
    ([h, s]) => h + s * 5
  );
  const sceneOpacity = useTransform(labProgress, [0, 0.8], [1, 0]);

  const [step, setStep] = useState(0);
  const [sceneActive, setSceneActive] = useState(true);

  useMotionValueEvent(stage, "change", (v) => {
    const next = Math.min(5, Math.max(0, Math.floor(v + 0.1)));
    setStep((prev) => (prev === next ? prev : next));
  });
  useMotionValueEvent(labProgress, "change", (v) => {
    setSceneActive(v < 0.99);
  });

  // Scroll offset at which `stage` reaches s (inverse of the transform above).
  const scrollForStage = (s) => {
    const hero = heroRef.current;
    const story = storyRef.current;
    if (s <= 1) return hero.offsetTop + s * hero.offsetHeight;
    return story.offsetTop + ((s - 1) / 5) * (story.offsetHeight - window.innerHeight);
  };

  // Jumping straight to #how skips the pour, so scroll down to just before it
  // starts, then play it through at a steady pace to the end of the sweep.
  const lenis = useLenis();
  const playHow = (e) => {
    if (!lenis || !heroRef.current || !storyRef.current) return;
    e.preventDefault();
    // Keep Lenis's own anchor handler (on window) from overriding this.
    e.nativeEvent.stopPropagation();
    lenis.scrollTo(scrollForStage(0.42), {
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      onComplete: () =>
        lenis.scrollTo(scrollForStage(1.88), {
          duration: 5.5,
          easing: (t) => t * t * (3 - 2 * t),
        }),
    });
  };

  return (
    <main id="top">
      {!reduced && <ReactLenis root options={{ lerp: 0.1, anchors: true }} />}

      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: sceneOpacity }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_68%_38%,#ffffff_0%,rgba(255,255,255,0)_70%),radial-gradient(40%_40%_at_10%_90%,#dce3f4_0%,rgba(220,227,244,0)_70%)]" />
        <CausalScene
          stage={stage}
          step={step}
          reduced={reduced}
          active={sceneActive}
        />
      </motion.div>

      <div ref={heroRef}>
        <Hero progress={heroProgress} reduced={reduced} onHow={playHow} />
      </div>
      <Story ref={storyRef} step={step} progress={storyProgress} reduced={reduced} />
      <Lab ref={labRef} reduced={reduced} />
    </main>
  );
}
