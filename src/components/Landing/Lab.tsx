"use client";
import { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TestModule } from "@/components/Organisms/TestModule/TestModule.controller";
import { GenerateModule } from "@/components/Organisms/GenerateModule/GenerateModule.controller";

const TABS = [
  { id: "test", label: "Test models" },
  { id: "generate", label: "Generate benchmarks" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const Lab = forwardRef<HTMLElement, { reduced: boolean }>(
  ({ reduced }, ref) => {
    const [tab, setTab] = useState<TabId>("test");

    return (
      <section
        ref={ref}
        id="lab"
        className="relative z-20 -mt-[1px] rounded-t-[2.5rem] bg-porcelain px-5 pb-24 pt-16 shadow-[0_-30px_60px_-30px_rgba(19,26,46,0.25)] sm:rounded-t-[3.5rem] sm:px-10 sm:pt-24"
      >
        <div className="mx-auto max-w-6xl">
          <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.04em] [font-variation-settings:'wdth'_82]">
                The lab
              </h2>
              <p className="mt-5 font-serif text-[1.45rem] leading-[2.3rem] text-ink-soft">
                Put a what-if question to several models at once and see who
                follows the ripple, or have a model write fresh benchmark
                scenarios for you.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Lab mode"
              className="flex w-full rounded-full border border-glaze bg-white/70 p-1.5 sm:w-auto"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`relative flex-1 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold transition-colors sm:flex-none ${
                    tab === t.id ? "text-porcelain" : "text-ink-soft hover:text-cobalt"
                  }`}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="lab-tab"
                      className="absolute inset-0 rounded-full bg-cobalt"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </header>

          <div className="mt-12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                id={`panel-${tab}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab}`}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {tab === "test" ? <TestModule /> : <GenerateModule />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="mx-auto mt-32 flex max-w-6xl flex-col gap-3 border-t border-glaze pt-8 text-base text-ink-faint sm:flex-row sm:justify-between">
          <p>Causalitea, an open benchmark for counterfactual reasoning in language models.</p>
          <a
            href="https://github.com/Mohak327/llm-causal-bench"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink-soft hover:text-cobalt"
          >
            Source on GitHub
          </a>
        </footer>
      </section>
    );
  }
);

Lab.displayName = "Lab";
