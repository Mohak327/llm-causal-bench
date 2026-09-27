import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check } from "lucide-react";
import { ERROR_TYPES, AVAILABLE_MODELS } from "./TestModule.model";
import { TestModuleViewProps } from "./TestModule.types";
import { Prose } from "@/components/Molecules/Prose/Prose";

const EASE = [0.22, 1, 0.36, 1] as const;

const ResultRow = ({ result, index }: { result: any; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const model = AVAILABLE_MODELS.find((m) => m.id === result.model) || {
    id: result.model,
    name: result.model,
    color: "bg-ink-faint",
  };
  const errorType = ERROR_TYPES.find((e) => e.code === result.errorType) || {
    code: -1,
    name: "Request failed",
    color: "bg-glaze text-ink-soft",
  };
  const accuracy = Math.max(0, Math.min(1, result.accuracy ?? 0));
  const long = (result.response?.length ?? 0) > 360;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE }}
      className="rounded-[1.75rem] border border-glaze bg-white/80 p-6 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${model.color}`} />
            <h4 className="text-xl font-semibold">{model.name}</h4>
          </div>
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${errorType.color}`}
          >
            {errorType.name}
          </span>

          <div className="mt-6">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink-soft">Accuracy</span>
              <span className="text-2xl font-bold tabular-nums">
                {(accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-glaze">
              <motion.div
                className={`h-full rounded-full ${accuracy > 0.7 ? "bg-cobalt" : "bg-kiln"}`}
                initial={{ width: 0 }}
                animate={{ width: `${accuracy * 100}%` }}
                transition={{ duration: 0.9, delay: 0.3 + index * 0.08, ease: EASE }}
              />
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-3 text-sm lg:grid-cols-1 lg:gap-2">
            <div className="lg:flex lg:justify-between">
              <dt className="text-ink-faint">Latency</dt>
              <dd className="font-semibold tabular-nums">
                {Number(result.latency).toLocaleString()} ms
              </dd>
            </div>
            <div className="lg:flex lg:justify-between">
              <dt className="text-ink-faint">Tokens</dt>
              <dd className="font-semibold tabular-nums">{result.tokenCount}</dd>
            </div>
            <div className="lg:flex lg:justify-between">
              <dt className="text-ink-faint">Calibration error</dt>
              <dd
                className={`font-semibold tabular-nums ${
                  result.ecr < 0.2 ? "text-leaf" : "text-tea-deep"
                }`}
              >
                {Number(result.ecr).toFixed(4)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="min-w-0 lg:border-l lg:border-glaze lg:pl-8">
          <div
            className={`relative overflow-hidden ${
              long && !expanded ? "max-h-48" : ""
            }`}
          >
            <Prose size="sm">{result.response}</Prose>
            {long && !expanded && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
          {long && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 text-sm font-semibold text-cobalt hover:text-ink"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Show full answer"}
            </button>
          )}
          {result.hallucination && (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-kiln">
              <AlertCircle className="h-4 w-4" />
              This answer may contain invented details.
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export const TestModuleView = ({
  textInput,
  setTextInput,
  queryInput,
  setQueryInput,
  selectedModels,
  toggleModel,
  testing,
  results,
  error,
  runTest,
  loadDummyData,
  fillExample,
}: TestModuleViewProps) => {
  const responses: any[] = results?.responses ?? [];
  const count = responses.length;
  const stats = count
    ? [
        {
          label: "Correct answers",
          value: `${Math.round(
            (responses.filter((r) => r.errorType === 0).length / count) * 100
          )}%`,
        },
        {
          label: "Mean calibration error",
          value: (
            responses.reduce((acc, r) => acc + r.ecr, 0) / count
          ).toFixed(4),
          note: "Lower is better",
        },
        {
          label: "Possible hallucinations",
          value: String(responses.filter((r) => r.hallucination).length),
        },
        { label: "Models tested", value: String(count) },
      ]
    : [];

  return (
    <div className="space-y-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <label htmlFor="test-story" className="field-label mb-0">
                The story
              </label>
              <button
                onClick={fillExample}
                className="text-sm font-semibold text-cobalt hover:text-ink"
              >
                Use the rainfall example
              </button>
            </div>
            <textarea
              id="test-story"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Describe what actually happened, for example: heavy rainfall saturated the soil, leading to an abundant harvest."
              className="field h-44 resize-none"
              data-lenis-prevent
            />
          </div>

          <div>
            <label htmlFor="test-query" className="field-label">
              The what-if question
            </label>
            <textarea
              id="test-query"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="What if there had been a drought instead?"
              className="field h-28 resize-none"
              data-lenis-prevent
            />
          </div>
        </div>

        <div className="space-y-6">
          <fieldset>
            <legend className="field-label">Models to ask</legend>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((model) => {
                const on = selectedModels.includes(model.id);
                return (
                  <button
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left font-semibold transition-colors ${
                      on
                        ? "border-cobalt bg-white text-ink"
                        : "border-glaze bg-white/40 text-ink-faint hover:border-ink-faint"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${model.color} ${
                        on ? "" : "opacity-40"
                      }`}
                    />
                    <span className="flex-1">{model.name}</span>
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full transition-colors ${
                        on ? "bg-cobalt text-porcelain" : "border border-glaze"
                      }`}
                    >
                      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-3">
            <button
              onClick={runTest}
              disabled={
                testing || !textInput || !queryInput || selectedModels.length === 0
              }
              className="btn-primary w-full"
            >
              {testing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-porcelain border-t-transparent" />
                  Asking {selectedModels.length}{" "}
                  {selectedModels.length === 1 ? "model" : "models"}
                </>
              ) : (
                "Run the test"
              )}
            </button>
            <button onClick={loadDummyData} className="btn-quiet w-full">
              Load a sample result
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl bg-kiln-mist px-4 py-3 text-sm text-kiln"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {count > 0 && (
        <div key={responses.map((r) => r.model + r.latency).join()} className="space-y-6">
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-x-5 gap-y-6 rounded-[1.75rem] bg-ink px-6 py-7 text-porcelain sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-white/15"
          >
            {stats.map((s) => (
              <div key={s.label} className="lg:px-6 lg:first:pl-0">
                <dt className="text-sm text-porcelain/70">{s.label}</dt>
                <dd className="mt-1 text-4xl font-bold tabular-nums tracking-tight">
                  {s.value}
                </dd>
                {s.note && (
                  <dd className="mt-1 text-xs text-porcelain/55">{s.note}</dd>
                )}
              </div>
            ))}
          </motion.dl>

          {responses.map((result, idx) => (
            <ResultRow key={idx} result={result} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
