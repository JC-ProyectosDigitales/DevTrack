export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
      <h1 className="text-2xl font-bold tracking-tight">DevTrack</h1>

      <nav className="mt-10 space-y-2">
        <a
          href="#"
          className="block rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Proyectos
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          Tareas
        </a>
      </nav>
    </aside>
  );
}