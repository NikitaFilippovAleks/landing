import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Skills } from "./pages/Skills";
import { Projects } from "./pages/Projects";
import { Settings } from "./pages/Settings";
import { logout } from "./lib/api";

// Один экземпляр QueryClient на всё приложение
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Повторная загрузка при возврате на вкладку
      refetchOnWindowFocus: false,
      // Одна попытка — при ошибке сразу показываем
      retry: 1,
    },
  },
});

/**
 * Корневой компонент приложения.
 * Содержит провайдеры (QueryClient, Router) и маршруты.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * Маршруты приложения.
 * Вынесены в отдельный компонент, чтобы useAuth мог использовать контекст Router.
 */
function AppRoutes() {
  const { authed, loading, onLogin, onLogout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout();
    // QueryClient очищается, чтобы при повторном входе данные были свежими
    queryClient.clear();
  };

  // Пока проверяем refresh-токен — показываем загрузку
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-white/50">Загрузка...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Логин — доступен только неавторизованным */}
      <Route
        path="/login"
        element={
          authed ? (
            <Navigate to="/skills" replace />
          ) : (
            <Login onLogin={onLogin} />
          )
        }
      />

      {/* Защищённые маршруты — обёрнуты в Layout с сайдбаром */}
      <Route
        element={
          <ProtectedRoute authed={authed}>
            <Layout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Все остальные пути → редирект на навыки (или логин) */}
      <Route
        path="*"
        element={<Navigate to={authed ? "/skills" : "/login"} replace />}
      />
    </Routes>
  );
}
