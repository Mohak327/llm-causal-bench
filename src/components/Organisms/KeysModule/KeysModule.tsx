"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, EyeOff, FileUp, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { BYOK_PROVIDERS, MODELS, PROVIDERS, type ProviderId } from "@/services/llm/models";
import { parseEnvFile, type KeyVault, type UserKeys } from "@/services/llm/keyVault";

const MIN_PASSPHRASE = 8;

const PrivacyNote = () => (
  <div className="flex gap-3 rounded-2xl bg-cobalt-mist/60 p-5 text-sm leading-6 text-ink-soft">
    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cobalt" />
    <p>
      Your keys are encrypted with your passphrase and stored only in this
      browser. They're sent to our server with each test, used for that one
      call, and never saved or logged. Reloading the page locks them again.
    </p>
  </div>
);

// Create a passphrase (first visit) or unlock an existing vault.
const PassphraseForm = ({ vault }: { vault: KeyVault }) => {
  const creating = vault.status === "empty";
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [visible, setVisible] = useState(false);
  const type = visible ? "text" : "password";

  const eye = (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      aria-label={visible ? "Hide passphrase" : "Show passphrase"}
      aria-pressed={visible}
      className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-faint hover:text-cobalt"
    >
      {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (creating) {
      if (passphrase.length < MIN_PASSPHRASE) {
        return setError(`Use at least ${MIN_PASSPHRASE} characters.`);
      }
      if (passphrase !== confirm) return setError("The passphrases don't match.");
    }
    setBusy(true);
    if (creating) await vault.create(passphrase);
    else if (!(await vault.unlock(passphrase))) setError("That passphrase didn't unlock your keys.");
    setBusy(false);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form onSubmit={submit} className="max-w-md space-y-5">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            {creating ? "Bring your own keys" : "Unlock your keys"}
          </h3>
          <p className="mt-2 font-serif text-lg leading-8 text-ink-soft">
            {creating
              ? "Choose a passphrase to encrypt your API keys in this browser. You'll enter it once per visit."
              : "Enter your passphrase to use the keys saved in this browser."}
          </p>
        </div>
        <div>
          <label htmlFor="vault-pass" className="field-label">
            Passphrase
          </label>
          <div className="relative">
            <input
              id="vault-pass"
              type={type}
              autoComplete={creating ? "new-password" : "current-password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="field pr-12"
              autoFocus
            />
            {eye}
          </div>
        </div>
        {creating && (
          <div>
            <label htmlFor="vault-confirm" className="field-label">
              Confirm passphrase
            </label>
            <div className="relative">
              <input
                id="vault-confirm"
                type={type}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="field pr-12"
              />
              {eye}
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="rounded-2xl bg-kiln-mist px-4 py-3 text-sm text-kiln">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy || !passphrase} className="btn-primary w-full">
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-porcelain border-t-transparent" />
          ) : creating ? (
            <>
              <KeyRound className="h-4 w-4" /> Create passphrase
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Unlock
            </>
          )}
        </button>
        {!creating &&
          (confirmReset ? (
            <p className="text-sm text-ink-soft">
              This deletes the saved keys from this browser.{" "}
              <button
                type="button"
                onClick={vault.reset}
                className="font-semibold text-kiln hover:text-ink"
              >
                Delete them
              </button>{" "}
              ·{" "}
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="font-semibold text-cobalt hover:text-ink"
              >
                Cancel
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-sm font-semibold text-cobalt hover:text-ink"
            >
              Forgot your passphrase?
            </button>
          ))}
      </form>
      <PrivacyNote />
    </div>
  );
};

type Status = { label: string; tone: string };

const providerStatus = (
  provider: ProviderId,
  saved: UserKeys,
  draft: UserKeys,
  serverAvailable: string[] | null
): Status => {
  const env = PROVIDERS[provider].env;
  const filled = env.filter((n) => draft[n]).length;
  const changed = env.some((n) => (draft[n] ?? "") !== (saved[n] ?? ""));
  if (filled > 0 && filled < env.length) return { label: "Needs every field", tone: "bg-kiln-mist text-kiln" };
  if (changed) return { label: "Unsaved", tone: "bg-tea-mist text-tea-deep" };
  if (filled === env.length) return { label: "Your key", tone: "bg-leaf-mist text-leaf" };
  const siteHasIt = MODELS.some((m) => m.provider === provider && serverAvailable?.includes(m.id));
  return siteHasIt
    ? { label: "Using site key", tone: "bg-cobalt-mist text-cobalt" }
    : { label: "Not set", tone: "bg-glaze text-ink-soft" };
};

const ProviderCard = ({
  provider,
  saved,
  draft,
  serverAvailable,
  onChange,
}: {
  provider: ProviderId;
  saved: UserKeys;
  draft: UserKeys;
  serverAvailable: string[] | null;
  onChange: (name: string, value: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const { label, env, keyUrl } = PROVIDERS[provider];
  const models = MODELS.filter((m) => m.provider === provider);
  const status = providerStatus(provider, saved, draft, serverAvailable);

  return (
    <article className="rounded-[1.5rem] border border-glaze bg-white/80 p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold">{label}</h4>
          {keyUrl && (
            <a
              href={keyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-cobalt hover:text-ink"
            >
              Get a key ↗
            </a>
          )}
        </div>
        <span
          className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.tone}`}
        >
          {status.label}
        </span>
      </header>

      <div className="mt-4 space-y-3">
        {env.map((name) => (
          <div key={name}>
            <label htmlFor={`key-${name}`} className="mb-1 block font-mono text-xs text-ink-faint">
              {name}
            </label>
            <div className="relative">
              <input
                id={`key-${name}`}
                type={visible ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                value={draft[name] ?? ""}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder="Not set"
                className="w-full rounded-xl border border-glaze bg-white px-3.5 py-2.5 pr-11 font-mono text-sm text-ink outline-none transition-colors placeholder:font-sans placeholder:text-ink-faint focus:border-cobalt"
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? `Hide ${label} key` : `Show ${label} key`}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-ink-faint hover:text-cobalt"
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-ink-faint">
        Unlocks {models.map((m) => m.label).join(", ")}
      </p>
    </article>
  );
};

const KeysEditor = ({
  vault,
  serverAvailable,
}: {
  vault: KeyVault;
  serverAvailable: string[] | null;
}) => {
  const [draft, setDraft] = useState<UserKeys>(vault.keys);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(vault.keys), [vault.keys]);

  const dirty = BYOK_PROVIDERS.some((p) =>
    PROVIDERS[p].env.some((n) => (draft[n] ?? "") !== (vault.keys[n] ?? ""))
  );

  const save = async () => {
    setSaving(true);
    await vault.save(draft);
    setSaving(false);
    setNotice("Saved and encrypted in this browser.");
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    const found = parseEnvFile(await file.text());
    const count = Object.keys(found).length;
    setDraft((d) => ({ ...d, ...found }));
    setNotice(
      count
        ? `Found ${count} ${count === 1 ? "key" : "keys"} in ${file.name}. Review them, then save.`
        : `No keys we recognise in ${file.name}.`
    );
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <span className="h-2 w-2 rounded-full bg-leaf" />
          Unlocked for this visit
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            accept=".env,.txt,text/plain"
            className="hidden"
            onChange={(e) => importFile(e.target.files?.[0])}
          />
          <button onClick={() => fileInput.current?.click()} className="btn-quiet">
            <FileUp className="h-4 w-4" /> Import .env file
          </button>
          <button onClick={vault.lock} className="btn-quiet">
            <Lock className="h-4 w-4" /> Lock
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {BYOK_PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider}
            provider={provider}
            saved={vault.keys}
            draft={draft}
            serverAvailable={serverAvailable}
            onChange={(name, value) => {
              setNotice("");
              setDraft((d) => ({ ...d, [name]: value }));
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AnimatePresence mode="wait">
          {notice ? (
            <motion.p
              key={notice}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-ink-soft"
            >
              <Check className="h-4 w-4 text-leaf" /> {notice}
            </motion.p>
          ) : (
            <span />
          )}
        </AnimatePresence>
        <button onClick={save} disabled={!dirty || saving} className="btn-primary">
          {saving ? "Encrypting…" : "Save keys"}
        </button>
      </div>

      <PrivacyNote />
    </div>
  );
};

export const KeysModule = ({
  vault,
  serverAvailable,
}: {
  vault: KeyVault;
  serverAvailable: string[] | null;
}) => {
  if (vault.status === "loading") return null;
  if (vault.status !== "unlocked") return <PassphraseForm vault={vault} />;
  return <KeysEditor vault={vault} serverAvailable={serverAvailable} />;
};
