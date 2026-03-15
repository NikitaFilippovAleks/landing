import { useState, useEffect, useCallback } from "react";
import { isAuthenticated, clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from "../lib/auth";
import type { TokenResponse } from "@portfolio/shared-types";

/**
 * Хук для управления состоянием авторизации.
 * При монтировании пытается восстановить сессию через refresh token.
 */
export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Попытка восстановить сессию при загрузке
  useEffect(() => {
    const restore = async () => {
      const refresh = getRefreshToken();
      if (!refresh) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });

        if (res.ok) {
          const data: TokenResponse = await res.json();
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setAuthed(true);
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }

      setLoading(false);
    };

    restore();
  }, []);

  const onLogin = useCallback(() => setAuthed(true), []);

  const onLogout = useCallback(() => {
    clearTokens();
    setAuthed(false);
  }, []);

  return { authed, loading, onLogin, onLogout };
}
