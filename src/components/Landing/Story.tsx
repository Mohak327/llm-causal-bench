"use client";
import { forwardRef, type ReactNode } from "react";
import { AnimatePresence, motion, type MotionValue } from "motion/react";

interface Step {
  title: string;
  body: ReactNode;
  notation: ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Draw the causes",
    body: "Every test starts as a causal graph. The season sets the rainfall, the rain wets the soil, and the soil feeds the harvest. Arrows only run one way.",
    notation: <>G = (variables, arrows)</>,
  },
  {
    title: "Tell it as a story",
    body: "The graph is written up as a short story for the model to read: a wet spring, heavy rain, soil that stayed moist all summer, and the best harvest in years.",
    notation: <>T, what actually happened</>,
  },
  {
    title: "Change one thing",
    body: "Now suppose there had been a drought. Rainfall is set by hand, which cuts it off from the season that normally drives it. Nothing else is told what to do.",
    notation: <>do(Rainfall = drought)</>,
  },
  {
    title: "Follow the ripple",
    body: "The change has to flow downstream. Less rain means parched soil, and parched soil means a failed harvest. The model has to trace every step on its own.",
    notation: (
      <>
        P(Harvest<sub className="text-[0.7em]">Rain = drought</sub> | T)
      </>
    ),
  },
  {
    title: "Grade the answer",
    body: (
      <>
        <p>
          The change must never flow backwards: it was still spring. Each answer
          is checked against the true outcome for three kinds of mistake.
        </p>
        <dl className="mt-5 space-y-3 font-display text-lg leading-7">
          <div>
            <dt className="font-semibold text-ink">Missed the ripple</dt>
            <dd className="text-ink-soft">Downstream effects left unchanged. Type I.</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Rewrote the past</dt>
            <dd className="text-ink-soft">Upstream causes changed. Type II.</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Guessed by association</dt>
            <dd className="text-ink-soft">
              Changes driven by words that merely appear together. Type III.
            </dd>
          </div>
        </dl>
      </>
    ),
    notation: <>S, the ground-truth outcome</>,
  },
];

export const Story = forwardRef<
  HTMLElement,
  { step: number; progress: MotionValue<number>; reduced: boolean }
>(({ step, progress, reduced }, ref) => {
  const index = Math.min(Math.max(step, 1), STEPS.length) - 1;
  const current = STEPS[index];

  return (
    <section
      ref={ref}
      id="how"
      className="relative z-10 h-[600vh]"
      aria-label="How the benchmark works"
    >
      <div className="sticky top-0 flex h-[100svh] items-end px-5 pb-8 sm:px-10 lg:items-center lg:pb-0">
        <div className="relative w-full max-w-[38rem] rounded-[2rem] bg-porcelain/85 p-6 backdrop-blur-md sm:p-8 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
          <ol className="mb-8 flex items-center gap-2" aria-label="Steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex items-center gap-2">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold transition-colors duration-500 ${
                    i === index
                      ? "bg-cobalt text-porcelain"
                      : i < index
                        ? "bg-cobalt-mist text-cobalt"
                        : "bg-white/70 text-ink-faint"
                  }`}
                  aria-current={i === index ? "step" : undefined}
                >
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="h-px w-5 bg-glaze sm:w-8" aria-hidden />
                )}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
                {current.title}
              </h2>
              <div className="mt-5 font-serif text-xl leading-9 text-ink-soft sm:text-[1.45rem] sm:leading-[2.4rem]">
                {current.body}
              </div>
              <p className="mt-6 inline-block rounded-full border border-glaze bg-white/60 px-5 py-2 font-serif text-xl italic text-cobalt">
                {current.notation}
              </p>
              {index === STEPS.length - 1 && (
                <div className="mt-8">
                  <a href="#lab" className="btn-primary">
                    Try it in the lab
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 hidden h-1 w-full overflow-hidden rounded-full bg-glaze/70 lg:block">
            <motion.div
              className="h-full origin-left rounded-full bg-cobalt"
              style={{ scaleX: progress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

Story.displayName = "Story";
