import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

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

          <div className="p-8">
            <h2 className="text-xl font-semibold">Listado de tareas</h2>

            <p className="mt-2 text-slate-400">
              Aquí mostraremos todas las tareas registradas en DevTrack.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}