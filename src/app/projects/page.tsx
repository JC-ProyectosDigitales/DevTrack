import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header
            title="Proyectos"
            description="Consulta y administra todos tus proyectos."
          />

          <div className="p-8">
            <h2 className="text-xl font-semibold">Listado de proyectos</h2>

            <p className="mt-2 text-slate-400">
              Aquí mostraremos todos los proyectos registrados en DevTrack.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}