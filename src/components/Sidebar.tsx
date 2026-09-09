import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
      <h1 className="text-2xl font-bold tracking-tight">DevTrack</h1>

      <nav className="mt-10 space-y-2">
        <Link
          href="/"
          className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Dashboard
        </Link>

        <Link
          href="/projects"
          className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Proyectos
        </Link>

        <Link
          href="/tasks"
          className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Tareas
        </Link>
      </nav>
    </aside>
  );
}