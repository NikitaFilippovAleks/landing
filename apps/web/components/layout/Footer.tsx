export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Nikita Filippov. Все права
            защищены.
          </p>
          <p className="text-sm text-white/40">
            Сделано с{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Next.js
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              FastAPI
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
