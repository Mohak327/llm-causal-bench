// A user's own API keys, encrypted in their browser with a passphrase they
// choose. The server never stores them: they ride along with each request in
// KEYS_HEADER and are dropped when the call ends.
import { useCallback, useEffect, useState } from "react";
import { BYOK_ENV, KEYS_HEADER } from "./models";

export type UserKeys = Record<string, string>;

interface Sealed {
  v: 1;
  salt: string;
  iv: string;
  data: string;
}

const STORAGE_KEY = "causalitea.keys.v1";
// OWASP's 2023 guidance for PBKDF2-HMAC-SHA256.
const ITERATIONS = 600_000;

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function seal(keys: UserKeys, passphrase: string): Promise<Sealed> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(keys))
  );
  return { v: 1, salt: toB64(salt), iv: toB64(iv), data: toB64(new Uint8Array(data)) };
}

// Throws when the passphrase is wrong (AES-GCM authentication fails).
export async function unseal(sealed: Sealed, passphrase: string): Promise<UserKeys> {
  const key = await deriveKey(passphrase, fromB64(sealed.salt));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(sealed.iv) },
    key,
    fromB64(sealed.data)
  );
  return JSON.parse(new TextDecoder().decode(plain));
}

// Storage can be missing or throw (private windows, blocked site data).
function readSealed(): Sealed | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSealed(sealed: Sealed | null) {
  try {
    if (sealed) localStorage.setItem(STORAGE_KEY, JSON.stringify(sealed));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// Keeps only key names we know, trimmed and non-empty.
export function cleanKeys(keys: UserKeys): UserKeys {
  const clean: UserKeys = {};
  for (const name of BYOK_ENV) {
    const value = keys[name]?.trim();
    if (value) clean[name] = value;
  }
  return clean;
}

// Reads KEY=VALUE lines from a .env file, keeping only names we know.
export function parseEnvFile(text: string): UserKeys {
  const found: UserKeys = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) found[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return cleanKeys(found);
}

export function keysHeader(keys: UserKeys): Record<string, string> {
  return Object.keys(keys).length ? { [KEYS_HEADER]: btoa(JSON.stringify(keys)) } : {};
}

export type VaultStatus = "loading" | "empty" | "locked" | "unlocked";

export interface KeyVault {
  status: VaultStatus;
  keys: UserKeys;
  create: (passphrase: string) => Promise<void>;
  unlock: (passphrase: string) => Promise<boolean>;
  save: (keys: UserKeys) => Promise<void>;
  lock: () => void;
  reset: () => void;
}

// Unlocked keys and the passphrase live in memory only, so a reload locks
// the vault again.
export function useKeyVault(): KeyVault {
  const [status, setStatus] = useState<VaultStatus>("loading");
  const [keys, setKeys] = useState<UserKeys>({});
  const [passphrase, setPassphrase] = useState<string | null>(null);

  useEffect(() => setStatus(readSealed() ? "locked" : "empty"), []);

  const create = useCallback(async (pass: string) => {
    writeSealed(await seal({}, pass));
    setPassphrase(pass);
    setKeys({});
    setStatus("unlocked");
  }, []);

  const unlock = useCallback(async (pass: string) => {
    const sealed = readSealed();
    if (!sealed) return false;
    try {
      setKeys(cleanKeys(await unseal(sealed, pass)));
      setPassphrase(pass);
      setStatus("unlocked");
      return true;
    } catch {
      return false;
    }
  }, []);

  const save = useCallback(
    async (next: UserKeys) => {
      if (!passphrase) return;
      const clean = cleanKeys(next);
      writeSealed(await seal(clean, passphrase));
      setKeys(clean);
    },
    [passphrase]
  );

  const lock = useCallback(() => {
    setKeys({});
    setPassphrase(null);
    setStatus(readSealed() ? "locked" : "empty");
  }, []);

  const reset = useCallback(() => {
    writeSealed(null);
    setKeys({});
    setPassphrase(null);
    setStatus("empty");
  }, []);

  return { status, keys, create, unlock, save, lock, reset };
}
