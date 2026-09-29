import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { ERROR_TYPES } from "./TestModule.model";
import { findModel, modelGroups } from "@/services/llm/models";
import { TestModuleViewProps } from "./TestModule.types";
import { Prose } from "@/components/Molecules/Prose/Prose";
import { SCMGraph } from "@/components/Molecules/SCMGraph/SCMGraph";

const EASE = [0.22, 1, 0.36, 1] as const;

// The benchmark the answers were graded against: its graph and ground truth.
const ScmPanel = ({ scm }: { scm: any }) => {
  const intervened: string[] = scm.V ?? [];
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="overflow-hidden rounded-[2rem] border border-glaze bg-white/80"
      aria-label="Causal model used for grading"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <dl className="space-y-6 p-6 sm:p-8">
          <div>
            <dt className="mb-2 text-sm font-semibold text-ink-soft">The story</dt>
            <dd>
              <Prose size="sm">{scm.T}</Prose>
            </dd>
          </div>
          <div>
            <dt className="mb-2 text-sm font-semibold text-ink-soft">
              The what-if question
            </dt>
            <dd>
              <Prose size="sm">{scm.Q}</Prose>
            </dd>
          </div>
          {scm.S && (
            <div className="rounded-2xl bg-leaf-mist/60 p-5">
              <dt className="mb-2 text-sm font-semibold text-leaf">
                What should happen
              </dt>
              <dd>
                <Prose size="sm">{scm.S}</Prose>
              </dd>
            </div>
          )}
        </dl>
        <div className="border-t border-glaze bg-porcelain/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <SCMGraph nodes={scm.G.nodes} edges={scm.G.edges} intervened={intervened} />
          {intervened.length > 0 && (
            <p className="mt-4 text-sm text-ink-soft">
              Changed by hand:{" "}
              <span className="font-semibold text-tea-deep">
                {intervened
                  .map((k) => String(scm.G.nodes[k] ?? k).replace(/_/g, " "))
                  .join(", ")}
              </span>
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// Rank, model, verdict, accuracy, latency, tokens, chevron. Below sm the
// verdict tucks under the model name and latency/tokens move into the detail.
const ROW_GRID =
  "grid grid-cols-[1.5rem_minmax(0,1fr)_5.5rem_1rem] items-center gap-x-3 sm:grid-cols-[1.5rem_minmax(0,1.3fr)_9.5rem_minmax(0,1fr)_4rem_3.5rem_1rem] sm:gap-x-5";

const formatLatency = (result: any) =>
  result.cached ? "cached" : result.latency != null ? `${(result.latency / 1000).toFixed(1)} s` : "–";

const LeaderboardRow = ({
  result,
  rank,
  open,
  onToggle,
}: {
  result: any;
  rank: number;
  open: boolean;
  onToggle: () => void;
}) => {
  const model = findModel(result.model) ?? { label: result.model, color: "bg-ink-faint" };
  const judge = result.judge ? findModel(result.judge)?.label ?? result.judge : null;
  const verdict = ERROR_TYPES.find((e) => e.code === result.errorType) ?? {
    name: "Request failed",
    color: "bg-glaze text-ink-soft",
  };
  const failed = result.success === false;
  const accuracy = Math.max(0, Math.min(1, result.accuracy ?? 0));
  const badge = (
    <span
      title={verdict.name}
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${verdict.color}`}
    >
      {verdict.name.replace(/ \(Type (I+)\)/, "")}
    </span>
  );

  return (
    <li className="border-t border-glaze first:border-t-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`${ROW_GRID} w-full px-4 py-4 text-left transition-colors hover:bg-porcelain/70 focus-visible:rounded-none focus-visible:[outline-offset:-2px] sm:px-6`}
      >
        <span className="text-sm font-semibold tabular-nums text-ink-faint">{rank}</span>
        <span className="min-w-0">
          <span className="flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${model.color}`} />
            <span className="truncate font-semibold">{model.label}</span>
          </span>
          <span className="mt-1 block sm:hidden">{badge}</span>
        </span>
        <span className="hidden sm:block">{badge}</span>
        <span className="flex items-center gap-3">
          <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-glaze sm:block">
            <motion.span
              className={`block h-full rounded-full ${accuracy > 0.7 ? "bg-cobalt" : "bg-kiln"}`}
              initial={{ width: 0 }}
              animate={{ width: `${accuracy * 100}%` }}
              transition={{ duration: 0.8, delay: 0.1 + rank * 0.05, ease: EASE }}
            />
          </span>
          <span className="w-12 text-right font-bold tabular-nums">
            {failed ? "–" : `${Math.round(accuracy * 100)}%`}
          </span>
        </span>
        <span className="hidden text-right text-sm tabular-nums text-ink-soft sm:block">
          {formatLatency(result)}
        </span>
        <span className="hidden text-right text-sm tabular-nums text-ink-soft sm:block">
          {result.outputTokens ?? "–"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-5 mt-2 space-y-5 rounded-2xl bg-porcelain/70 p-5 sm:mx-6 sm:p-6">
              {failed ? (
                <p role="alert" className="text-sm text-kiln">
                  {result.error ?? result.reasoning}
                </p>
              ) : (
                <>
                  <div>
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                      Answer
                    </h5>
                    <Prose size="sm">{result.response}</Prose>
                    {result.hallucination && (
                      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-kiln">
                        <AlertCircle className="h-4 w-4" />
                        This answer may contain invented details.
                      </p>
                    )}
                  </div>
                  {result.reasoning && (
                    <div className="border-l-2 border-cobalt-mist pl-4">
                      <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                        Why this grade{judge && ` · judged by ${judge}`}
                      </h5>
                      <p className="text-sm leading-6 text-ink-soft">{result.reasoning}</p>
                    </div>
                  )}
                  <p className="text-xs text-ink-faint sm:hidden">
                    {formatLatency(result)} · {result.outputTokens ?? "–"} tokens
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

// Best answer first; failed requests sink to the bottom.
const Leaderboard = ({ responses }: { responses: any[] }) => {
  const ranked = [...responses].sort(
    (a, b) =>
      Number(b.success !== false) - Number(a.success !== false) ||
      (b.accuracy ?? 0) - (a.accuracy ?? 0)
  );
  const [openModel, setOpenModel] = useState<string | null>(ranked[0]?.model ?? null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
      className="overflow-hidden rounded-[1.75rem] border border-glaze bg-white/80"
      aria-label="Results by model"
    >
      <div
        className={`${ROW_GRID} border-b border-glaze px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-faint sm:px-6`}
        aria-hidden
      >
        <span>#</span>
        <span>Model</span>
        <span className="hidden sm:block">Verdict</span>
        <span className="text-right sm:text-left">Accuracy</span>
        <span className="hidden text-right sm:block">Latency</span>
        <span className="hidden text-right sm:block">Tokens</span>
        <span />
      </div>
      <ol>
        {ranked.map((result, i) => (
          <LeaderboardRow
            key={result.model}
            result={result}
            rank={i + 1}
            open={openModel === result.model}
            onToggle={() => setOpenModel((m) => (m === result.model ? null : result.model))}
          />
        ))}
      </ol>
    </motion.section>
  );
};

export const TestModuleView = ({
  textInput,
  setTextInput,
  queryInput,
  setQueryInput,
  selectedModels,
  available,
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
          label: "Mean accuracy",
          value: `${Math.round(
            (responses.reduce((acc, r) => acc + (r.accuracy ?? 0), 0) / count) * 100
          )}%`,
          note: "As graded by the judge model",
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
            <legend className="field-label">
              Models to ask
              {selectedModels.length > 0 && (
                <span className="ml-2 font-normal text-ink-faint">
                  {selectedModels.length} selected
                </span>
              )}
            </legend>
            <div
              className="max-h-[30rem] space-y-5 overflow-y-auto pr-1"
              data-lenis-prevent
            >
              {modelGroups(available).map((group) =>
                group.enabled ? (
                  <div key={group.provider}>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                      {group.label}
                    </h4>
                    <div className="space-y-1.5">
                      {group.models.map((model) => {
                        const on = selectedModels.includes(model.id);
                        return (
                          <button
                            key={model.id}
                            onClick={() => toggleModel(model.id)}
                            aria-pressed={on}
                            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left font-semibold transition-colors ${
                              on
                                ? "border-cobalt bg-white text-ink"
                                : "border-glaze bg-white/40 text-ink-faint hover:border-ink-faint"
                            }`}
                          >
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${model.color} ${
                                on ? "" : "opacity-40"
                              }`}
                            />
                            <span className="flex-1">
                              {model.label}
                              <span className="block text-xs font-normal text-ink-faint">
                                {model.limits}
                              </span>
                            </span>
                            <span
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors ${
                                on ? "bg-cobalt text-porcelain" : "border border-glaze"
                              }`}
                            >
                              {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p
                    key={group.provider}
                    className="rounded-2xl border border-dashed border-glaze px-4 py-2.5 text-sm text-ink-faint"
                  >
                    <span className="font-semibold text-ink-soft">{group.label}</span>
                    {" · "}
                    {group.models.length} {group.models.length === 1 ? "model" : "models"}
                    <span className="block text-xs">
                      Add {group.missingEnv.join(" + ")} to enable
                    </span>
                  </p>
                )
              )}
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
          {results?.scm?.G && <ScmPanel scm={results.scm} />}
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

          <Leaderboard responses={responses} />
        </div>
      )}
    </div>
  );
};
