import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { AVAILABLE_MODELS, PROMPT_IDEAS } from "./GenerateModule.model";
import { SCMGraph } from "@/components/Molecules/SCMGraph/SCMGraph";
import { Prose } from "@/components/Molecules/Prose/Prose";
import { GenerateModuleViewProps } from "./GenerateModule.types";

const EASE = [0.22, 1, 0.36, 1] as const;

// Renders "T_{A=low_dose}" style notation with real subscripts.
const Notation = ({ text }: { text: string }) => (
  <>
    {text.split(/_\{([^}]*)\}/).map((part, i) =>
      i % 2 ? (
        <sub key={i} className="text-[0.7em]">
          {part.replace(/_/g, " ")}
        </sub>
      ) : (
        part
      )
    )}
  </>
);

const modelName = (id?: string) =>
  AVAILABLE_MODELS.find((m) => m.id === id)?.name ?? id ?? "Claude";

export const GenerateModuleView = ({
  prompt,
  setPrompt,
  generating,
  generatedSCMs,
  selectedModel,
  setSelectedModel,
  error,
  generateSCMs,
  copyToClipboard,
  copiedId,
  loadDummyData,
}: GenerateModuleViewProps) => {
  return (
    <div className="space-y-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <label htmlFor="gen-prompt" className="field-label">
            What should the scenario be about?
          </label>
          <textarea
            id="gen-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe a situation with a few linked causes, for example: a drug's dosage, a patient's blood pressure and how quickly they recover."
            className="field h-44 resize-none"
            data-lenis-prevent
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {PROMPT_IDEAS.map((idea) => (
              <button
                key={idea}
                onClick={() => setPrompt(idea)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  prompt === idea
                    ? "border-cobalt bg-cobalt-mist text-cobalt"
                    : "border-glaze bg-white/50 text-ink-soft hover:border-cobalt hover:text-cobalt"
                }`}
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <fieldset>
            <legend className="field-label">Model that writes it</legend>
            <div className="space-y-2" role="radiogroup">
              {AVAILABLE_MODELS.map((model) => {
                const on = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setSelectedModel(model.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left font-semibold transition-colors ${
                      on
                        ? "border-cobalt bg-white text-ink"
                        : "border-glaze bg-white/40 text-ink-faint hover:border-ink-faint"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                        on ? "border-cobalt" : "border-glaze"
                      }`}
                    >
                      {on && <span className="h-2 w-2 rounded-full bg-cobalt" />}
                    </span>
                    {model.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-3">
            <button
              onClick={generateSCMs}
              disabled={generating || !prompt}
              className="btn-primary w-full"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-porcelain border-t-transparent" />
                  Writing the scenario
                </>
              ) : (
                "Generate a scenario"
              )}
            </button>
            <button onClick={loadDummyData} className="btn-quiet w-full">
              Load sample scenarios
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

      {generatedSCMs.length > 0 && (
        <div className="space-y-8">
          {generatedSCMs.map((scm, index) => {
            const intervened: string[] = scm.V ?? [];
            return (
              <motion.article
                key={scm.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
                className="overflow-hidden rounded-[2rem] border border-glaze bg-white/80"
              >
                <header className="flex items-center justify-between gap-4 border-b border-glaze px-6 py-4 sm:px-8">
                  <p className="text-sm text-ink-soft">
                    Written by{" "}
                    <span className="font-semibold text-ink">
                      {modelName(scm.generatedBy)}
                    </span>{" "}
                    on {new Date(scm.timestamp).toLocaleString()}
                  </p>
                  <button
                    onClick={() => copyToClipboard(scm)}
                    className="btn-quiet shrink-0 px-4 py-2"
                  >
                    {copiedId === scm.id ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy JSON
                      </>
                    )}
                  </button>
                </header>

                <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <dl className="space-y-7 p-6 sm:p-8">
                    <div>
                      <dt className="mb-2 text-sm font-semibold text-ink-soft">
                        The story
                      </dt>
                      <dd>
                        <Prose>{scm.T}</Prose>
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-2 text-sm font-semibold text-ink-soft">
                        The what-if question
                      </dt>
                      <dd>
                        <Prose>{scm.Q}</Prose>
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
                    {scm.M && (
                      <div>
                        <dt className="mb-2 text-sm font-semibold text-ink-soft">
                          Formally
                        </dt>
                        <dd className="inline-block rounded-full border border-glaze px-4 py-1.5 font-serif text-lg italic text-cobalt">
                          <Notation text={scm.M} />
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="border-t border-glaze bg-porcelain/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
                    <SCMGraph
                      nodes={scm.G.nodes}
                      edges={scm.G.edges}
                      intervened={intervened}
                    />
                    <ul className="mt-6 space-y-2 text-sm">
                      {Object.entries(scm.G.nodes).map(([key, val]) => {
                        const isV = intervened.includes(key);
                        return (
                          <li key={key} className="flex items-center gap-3">
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                                isV
                                  ? "bg-tea text-white"
                                  : "bg-cobalt-mist text-cobalt"
                              }`}
                            >
                              {key}
                            </span>
                            <span className="text-ink">
                              {String(val).replace(/_/g, " ")}
                            </span>
                            {isV && (
                              <span className="text-xs font-semibold text-tea-deep">
                                changed by hand
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
};
