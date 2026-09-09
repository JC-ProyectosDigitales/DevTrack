import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header />

          <div className="p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Proyectos activos"
                value={4}
                description="Proyectos actualmente en desarrollo"
              />

              <StatCard
                title="Tareas pendientes"
                value={12}
                description="Tareas que requieren atención"
              />

              <StatCard
                title="Tareas completadas"
                value={28}
                description="Tareas finalizadas"
              />

              <StatCard
                title="Tareas vencidas"
                value={3}
                description="Tareas fuera de la fecha límite"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}