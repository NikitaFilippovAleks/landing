/**
 * Управление JWT-токенами.
 * Access token хранится в памяти (переменная), refresh — в localStorage.
 */

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function setRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem("refresh_token", token);
  } else {
    localStorage.removeItem("refresh_token");
  }
}

export function clearTokens() {
  accessToken = null;
  localStorage.removeItem("refresh_token");
}

export function isAuthenticated(): boolean {
  return !!accessToken || !!getRefreshToken();
}
