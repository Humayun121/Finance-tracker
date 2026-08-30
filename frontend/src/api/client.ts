import { AUTH_EXPIRED_EVENT, clearTokens, getAccessToken, getRefreshToken, setAccessToken } from '../auth/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  setAccessToken(data.access);
  return data.access;
}

/** Clears tokens and tells AuthContext the session is dead, so it can redirect to /login. */
function endExpiredSession(): void {
  clearTokens();
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

/**
 * Fetch wrapper that attaches the JWT access token and retries once
 * with a refreshed token on a 401 before giving up.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const doFetch = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(getAccessToken());

  if (res.status === 401) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await doFetch(newAccess);
      if (res.status === 401) {
        endExpiredSession();
      }
    } else {
      endExpiredSession();
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, `Request to ${path} failed with status ${res.status}`);
  }

  return res;
}
