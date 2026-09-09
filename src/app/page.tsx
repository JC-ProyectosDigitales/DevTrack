import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header />

          <div className="p-8">
            <h3 className="text-lg font-semibold">Bienvenido a DevTrack</h3>

            <p className="mt-2 max-w-2xl text-slate-400">
              Aquí podrás consultar el progreso de tus proyectos, revisar tareas
              pendientes y mantener organizado tu trabajo.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}