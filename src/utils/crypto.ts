let sessionKey: CryptoKey | null = null;

export function setSessionKey(key: CryptoKey) {
  sessionKey = key;
}

export function getSessionKey(): CryptoKey {
  if (!sessionKey) throw new Error("Vault locked");
  return sessionKey;
}

export function clearSessionKey() {
  sessionKey = null;
}


async function deriveKey(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();

  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt : salt as BufferSource,
      iterations: 120000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}


export async function encryptWithPassword(
  value: unknown,
  password: string
) {
  const enc = new TextEncoder();

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);
  setSessionKey(key);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(JSON.stringify(value))
  );

  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}


export async function decryptWithPassword(
  payload: any,
  password: string
) {
  const dec = new TextDecoder();

  const salt = new Uint8Array(payload.salt);
  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);

  const key = await deriveKey(password, salt);
  

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  setSessionKey(key);

  return JSON.parse(dec.decode(decrypted));
}


export async function secureSet(key: string, value: unknown) {
  const cryptoKey = getSessionKey();
  const enc = new TextEncoder();

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    enc.encode(JSON.stringify(value))
  );

  const payload = {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };

  localStorage.setItem(key, JSON.stringify(payload));
}


export async function secureGet(key: string) {
  const cryptoKey = getSessionKey();
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const payload = JSON.parse(raw);

  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);

  const dec = new TextDecoder();

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );

  return JSON.parse(dec.decode(decrypted));
}


