import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";

export default function TasksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header
            title="Tareas"
            description="Consulta y administra las tareas de tus proyectos."
          />

          <div className="space-y-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Todas las tareas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Revisa el estado, prioridad y fecha límite de cada actividad.
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
              >
                Nueva tarea
              </button>
            </div>

            <TaskList />
          </div>
        </section>
      </div>
    </main>
  );
}