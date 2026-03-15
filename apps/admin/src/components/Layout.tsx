import { NavLink, Outlet } from "react-router";

interface LayoutProps {
  onLogout: () => void;
}

const NAV_ITEMS = [
  { to: "/skills", label: "Навыки", icon: "⚡" },
  { to: "/projects", label: "Проекты", icon: "📁" },
  { to: "/settings", label: "Настройки", icon: "⚙️" },
];

/**
 * Основной layout админки: сайдбар + контент.
 */
export function Layout({ onLogout }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Сайдбар */}
      <aside className="flex w-64 flex-col border-r border-white/10 bg-gray-900">
        {/* Логотип */}
        <div className="border-b border-white/10 px-6 py-5">
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Portfolio
            </span>
            <span className="text-white/50"> Admin</span>
          </h1>
        </div>

        {/* Навигация */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Выход */}
        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span>🚪</span>
            Выйти
          </button>
        </div>
      </aside>

      {/* Контент */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
