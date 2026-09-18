const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/** Dispatched on `window` when a request's refresh attempt fails or a refreshed token is still rejected. */
export const AUTH_EXPIRED_EVENT = 'auth:expired';

function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

/** True if there's no access token, or its `exp` claim is in the past (or unreadable). */
export function isAccessTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;
  const exp = decodeJwtExpiry(token);
  if (exp === null) return true;
  return Date.now() >= exp * 1000;
}

/**
 * "Keep me logged in" tokens live in localStorage; otherwise they live in
 * sessionStorage and end with the browser tab. Reads check both.
 */
function readToken(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

function activeStorage(): Storage {
  return localStorage.getItem(REFRESH_TOKEN_KEY) !== null ? localStorage : sessionStorage;
}

export function getAccessToken(): string | null {
  return readToken(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return readToken(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh: string, remember = true): void {
  clearTokens();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, access);
  storage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function setAccessToken(access: string): void {
  activeStorage().setItem(ACCESS_TOKEN_KEY, access);
}

export function clearTokens(): void {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
  }
}
