"use client";
import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LogoMark } from "@/components/Molecules/Logo/Logo";

const WORD = "Causalitea".split("");
const GITHUB_URL = "https://github.com/Mohak327/llm-causal-bench";

export const Hero = ({
  progress,
  reduced,
  onHow,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
  onHow?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const weightIn = useMotionValue(reduced ? 760 : 200);

  useEffect(() => {
    if (reduced) return;
    const controls = animate(weightIn, 760, {
      duration: 1.6,
      delay: 0.35,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [reduced, weightIn]);

  const variation = useTransform([weightIn, progress], ([w, p]: number[]) => {
    const weight = w - p * 520;
    const width = 75 + ((w - 200) / 560) * 25 - p * 20;
    return `"wght" ${weight}, "wdth" ${width}`;
  });
  const headlineY = useTransform(progress, [0, 1], ["0%", "-35%"]);
  const fade = useTransform(progress, [0, 0.55], [1, 0]);

  return (
    <section className="relative z-10 flex h-[100svh] flex-col px-4 pb-10 pt-7 sm:px-14 sm:pb-14 sm:pt-9 lg:px-16">
      <motion.nav
        data-cup-ceiling
        className="flex items-center justify-between"
        initial={reduced ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        style={{ opacity: fade }}
        suppressHydrationWarning
      >
        <a href="#top" className="flex shrink-0 items-center gap-2 text-xl font-bold sm:gap-2.5 sm:text-2xl tracking-[-0.02em]">
          <LogoMark className="h-8 w-8 sm:h-10 sm:w-10" />
          Causalitea
        </a>
        <div className="flex items-center gap-0 whitespace-nowrap text-[15px] font-semibold text-ink-soft sm:gap-3 sm:text-lg">
          <a href="#how" onClick={onHow} className="rounded-full px-3 py-2 hover:text-cobalt">
            How it works
          </a>
          <a href="#lab" className="rounded-full px-3 py-2 hover:text-cobalt">
            The lab
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-2 hover:text-cobalt sm:block"
          >
            GitHub
          </a>
        </div>
      </motion.nav>

      <div className="mt-auto">
        <motion.div
          data-cup-floor="narrow"
          className="max-w-xl pb-8 sm:pb-10"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0 }}
          style={{ opacity: fade }}
          suppressHydrationWarning
        >
          <p className="font-serif text-[1.3rem] leading-9 text-ink-soft sm:text-[1.6rem] sm:leading-[2.6rem]">
            If it hadn&rsquo;t rained, would the harvest have failed? Causalitea
            asks language models what-if questions about cause and effect, then
            checks whether their answers follow the arrows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#lab" className="btn-primary">
              Run a test
            </a>
            <a href="#how" onClick={onHow} className="btn-quiet px-8 py-4 text-lg">
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.h1
          data-cup-floor="wide"
          aria-label="Causalitea"
          className="select-none whitespace-nowrap text-[clamp(3.4rem,19.4vw,24rem)] leading-[0.82] tracking-[-0.045em] text-ink"
          style={{ fontVariationSettings: variation, y: headlineY, opacity: fade }}
          suppressHydrationWarning
        >
          <span className="-ml-[0.04em] block overflow-hidden pb-[0.08em]">
            {WORD.map((letter, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block"
                initial={reduced ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.1,
                  delay: 0.15 + i * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </motion.h1>
      </div>
    </section>
  );
};
