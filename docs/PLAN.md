# Causalitea: model list, inference review and roadmap

_Written 2026-09-27. Free-tier limits change often; re-check them before relying on them._

Tick items off as they land. Work order is the **Roadmap** at the bottom.

---

## 1. Done: causal graph in test results

- [x] The Test tab never rendered the causal graph: `SCMGraph` was only used in the Generate tab. `TestModule.view.tsx` now shows a panel above the scores with the story, the question, the expected answer and the graph, with the changed variable highlighted. Typecheck passes; not yet checked in the browser.

**Known bug this exposes:** `TestModule.controller.tsx` always grades answers against the rainfall sample (`SAMPLE_SCM`), whatever story is typed in. For any custom story the accuracy and error type are measured against the wrong ground truth, and the panel shows the rainfall graph. Fixed by Roadmap step 6.

---

## 2. Proposed model list (free or rate-limited)

Checked live on 2026-09-27: the OpenRouter models API, Groq's rate-limit docs, and the Gemini model list the existing `GEMINI_API_KEY` can reach.

| Provider (key) | Model ID | Free limit | Why include it |
|---|---|---|---|
| Gemini (`GEMINI_API_KEY`, have it) | `gemini-3.8-flash` | ~20 requests/day | Newest Gemini; too few requests for much more than spot checks |
| Gemini | `gemini-3.5-flash-lite` | ~500/day | Main Gemini workhorse |
| Gemini | `gemma-4-31b-it` | free | Google's open-weights model |
| Groq (`GROQ_API_KEY`) | `openai/gpt-oss-120b` | 30/min, 1K/day | Open-weights model from OpenAI |
| Groq | `openai/gpt-oss-20b` | 30/min, 1K/day | Pairs with 120b to compare model sizes |
| Groq | `qwen/qwen3.8-27b` | 30/min, 1K/day | Alibaba's model family |
| OpenRouter (`OPENROUTER_API_KEY`) | `nvidia/nemotron-3-ultra-550b-a55b:free` | 20/min, **50/day across all free models** | Largest free model |
| OpenRouter | `thinkingmachines/inkling:free` | shared | New model family |
| OpenRouter | `poolside/laguna-s-2.1:free` | shared | New model family |
| Paid, optional | Claude `claude-sonnet-5`, plus the current OpenAI model | paid | For comparison only; the current config uses `gpt-4` and `claude-sonnet-4-20250514`, both outdated |

Notes:
- **OpenRouter's 50/day is shared** across all its free models. It rises to 1,000/day after a one-off $10 credit purchase.
- **Training on your data:** Gemini's free tier and Mistral's free tier can train on what you send. Fine for public benchmark stories.
- **Leave out preview and "stealth" models** (e.g. `stealth/space-bunny-alpha`). They get renamed or pulled, which makes results impossible to reproduce.
- **Mistral** also has a free tier, but its current model IDs weren't confirmed, so it's left out for now.
- Both new keys are free and need no card.

---

## 3. Scorecard for the current LLM provider code (out of 10)

| Area | Score | Main problems |
|---|---|---|
| KISS | 4 | Four near-identical `callX` wrappers plus a `switch`. Gemini has 260 lines of rate limiting that doesn't work on serverless: its request history lives in memory and resets on every cold start. It can also try to wait up to 24h inside one request. |
| OOP | 4 | Classes are just holders for static functions. No shared provider interface. `LlamaService` exists only to throw an error. |
| SOLID | 3 | **Open/closed:** adding a model means editing the `switch`, the setup code and two UI lists. **Dependency inversion:** providers are created directly and read environment variables themselves. **Single responsibility:** the Gemini class mixes rate limiting, prompt flattening and logging. |
| Code quality | 4 | `any` everywhere. Errors come back as answer text. No timeouts and no retry on 429. The model ID shown in the UI doesn't match the one called. The judge model defaults to Claude, which is paid and may grade its own answers. JSON is pulled out of replies with a greedy regex. **"Calibration error" is `(1-accuracy)*0.5`, which isn't a calibration measure.** |
| Inference practice | 3 | No temperature or seed control, so runs can't be reproduced. No structured outputs, one sample per model, no caching. Grading is a free-text LLM judge. |

---

## 4. Inference techniques for the causal benchmark (highest impact first)

1. **Grade in code instead of with an LLM judge.** Add structural equations to each scenario, with discrete values (e.g. `Soil = moist if Rain = heavy`). Compute the true what-if answer in code with the standard three-step counterfactual method: infer the hidden background factors from the story, apply the change, then recompute downstream. Ask each model for a JSON map `{variable: new value}`. Types I, II and III then become exact per-variable checks: downstream variables left unchanged, upstream variables changed, and changes to variables with no causal path from the change. About 100 lines of TypeScript for discrete graphs.
2. **Structured outputs.** Gemini's `responseSchema` and the `json_schema` response format on OpenAI-compatible APIs force valid JSON and remove the regex parsing.
3. **Reproducibility first:** temperature 0, a seed where supported, and each run stamped with the model ID and date.
4. **Real calibration.** Take several samples at a higher temperature and ask the model for a confidence level. Agreement between samples plus stated confidence gives a real ECE or Brier score across the test set, replacing the fake one.
5. **Controlled comparisons:** story only vs story with the graph included, plain answers vs step-by-step reasoning, and CLadder's CausalCoT prompt (extract graph → identify query type → compute).
6. **Detect association-guessing.** Rename variables to meaningless names, or use graphs that contradict common sense (CLadder has such a split). A model that still answers "rain → good harvest" when the graph says otherwise is guessing from word association (Type III).
7. **Protect the free quotas:** cache responses by model, prompt and parameters; queue requests per provider; back off using `Retry-After` on 429s; give up after ~20s with a clear error.
8. **If an LLM judge stays,** use a different model family from the one tested, have it return a JSON rubric, and report how often judges agree.

### Causal libraries

Keep the grading engine in TypeScript: there's no mature TypeScript causal library, and the in-app engine for discrete graphs is small. Use Python offline to generate and validate a fixed dataset:
- **pgmpy:** discrete Bayesian networks and the do-operator. Best fit for this project's discrete story variables.
- **DoWhy:** its `gcm` module can generate interventional and counterfactual samples.
- **y0:** checks whether a what-if question can be answered from the graph at all.
- **Datasets to borrow from:** CLadder, CRASS, Corr2Cause.

---

## 5. Roadmap

- [x] **1. Model registry.** `src/services/llm/models.ts`: one list of models with `{id, label, provider, modelId, family, color, limits, free, temperature, jsonMode}`. Both modules and the API read from it; the two duplicate `AVAILABLE_MODELS` lists are gone.
- [x] **2. One OpenAI-compatible provider.** `providers/OpenAIService.ts` (`OpenAICompatibleProvider`) covers Groq, OpenRouter and Gemini (via Gemini's OpenAI-compatible endpoint). `providers/ClaudeService.ts` (`AnthropicProvider`) uses the official `@anthropic-ai/sdk` for the paid option. `LlamaService`, the old Gemini class and `@google/generative-ai` are removed.
- [x] **3. `LLMService` cleanup.** Shared `LLMProvider` interface in `types.ts`, providers looked up from the registry instead of a `switch`, 90s timeouts, per-model temperature, JSON mode, typed `LLMError`, judge from a different model family, one tolerant JSON parser, SCM and grade shape validation. Seed was not added (not reliably supported across providers).
- [x] **4. Retries and caching.** Done inside `LLMService.complete` rather than a separate limiter: retries 429/5xx using `Retry-After` (max 2 retries, waits over 20s fail fast with a clear message), plus an in-memory cache for temperature-0 calls.
- [x] **5. Model availability.** `GET /api/test-models` returns the models whose keys are set; pickers collapse unconfigured providers into an "Add X to enable" line.
- [x] **5b. Bring your own keys.** "My keys" Lab tab: keys encrypted in the browser with a passphrase (PBKDF2 600K + AES-GCM, `src/services/llm/keyVault.ts`), sent per request in `x-causalitea-keys`, never stored or logged. Server validates key names, uses a fresh provider per request for user keys, keeps the cache apart per key, strips keys from errors. Known providers only; Ollama excluded (URL setting = SSRF risk). Follow-ups: per-IP rate limit, Content-Security-Policy header.
- [ ] **6. Grading fix.** The Test tab takes a scenario from the Generate tab or the sample instead of free text, and grades against that scenario (fixes the `SAMPLE_SCM` bug).
- [ ] **7. In-code grading engine** (technique 4.1).
- [ ] **8. Real calibration** (technique 4.4). The fake "Calibration error" has been removed from the UI and API; it comes back only when it's real.
- [ ] **9. Prompt-condition and association-guessing experiments** (techniques 4.5, 4.6).
- [ ] **10. Offline dataset** built and validated with pgmpy / DoWhy.

Setup before step 2: add `GROQ_API_KEY` and `OPENROUTER_API_KEY` to `.env.local`.

---

## Sources

- [Groq rate limits](https://console.groq.com/docs/rate-limits)
- [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits)
- [OpenRouter models API](https://openrouter.ai/api/v1/models)
- [OpenRouter: free LLM APIs compared](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/)
- [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini free tier 2026 (scriptbyai)](https://www.scriptbyai.com/gemini-api-free-tier-limits/)
- [Gemini free tier guide (pecollective)](https://pecollective.com/tools/gemini-free-tier-guide/)
- [KDnuggets: free LLM APIs 2026](https://www.kdnuggets.com/5-free-llm-api-providers-you-can-use-in-2026)
