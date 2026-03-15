/**
 * CSS-анимированный фон для мобильных устройств.
 * Заменяет 3D-сцену плавно анимированными blob-ами.
 * Серверный компонент — не требует JavaScript.
 */
export function MobileFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Фиолетовый blob */}
      <div className="animate-float-blob absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[128px]" />
      {/* Синий blob */}
      <div className="animate-float-blob-reverse absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[128px]" />
      {/* Голубой blob */}
      <div className="animate-float-blob-slow absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[96px]" />
    </div>
  );
}
