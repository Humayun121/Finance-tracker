const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TokenPair {
  access: string;
  refresh: string;
}

export async function login(username: string, password: string): Promise<TokenPair> {
  const res = await fetch(`${API_BASE_URL}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid username or password');
  }

  return res.json();
}

export async function register(username: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data && typeof data === 'object' ? Object.values(data).flat().join(' ') : '';
    throw new Error(message || 'Could not create account');
  }
}
