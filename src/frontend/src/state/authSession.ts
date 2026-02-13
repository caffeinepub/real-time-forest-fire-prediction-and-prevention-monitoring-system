const AUTH_KEY = 'forest_fire_auth';

export function login(): void {
  localStorage.setItem(AUTH_KEY, 'true');
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}
