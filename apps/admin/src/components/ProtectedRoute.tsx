import { Navigate } from "react-router";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  authed: boolean;
  children: ReactNode;
}

/**
 * Обёртка для защищённых маршрутов.
 * Перенаправляет на /login, если не авторизован.
 */
export function ProtectedRoute({ authed, children }: ProtectedRouteProps) {
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
