export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Project Management
          </p>

          <h1 className="text-5xl font-bold tracking-tight">DevTrack</h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Organiza proyectos, administra tareas y da seguimiento al progreso
            de tu equipo desde un solo lugar.
          </p>
        </div>
      </div>
    </main>
  );
}