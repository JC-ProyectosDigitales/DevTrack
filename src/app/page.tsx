import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import TaskItem from "@/components/TaskItem";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header />

          <div className="space-y-8 p-8">
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

            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Proyectos recientes
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Seguimiento de los proyectos en los que estás trabajando.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <ProjectCard
                  name="Sitio corporativo"
                  description="Rediseño y desarrollo del sitio principal de la empresa."
                  progress={75}
                  tasksCompleted={15}
                  totalTasks={20}
                />

                <ProjectCard
                  name="Panel de clientes"
                  description="Dashboard para consultar usuarios, actividad y métricas."
                  progress={45}
                  tasksCompleted={9}
                  totalTasks={20}
                />

                <ProjectCard
                  name="API de inventario"
                  description="Servicio para administrar productos, existencias y movimientos."
                  progress={60}
                  tasksCompleted={12}
                  totalTasks={20}
                />

                <ProjectCard
                  name="Aplicación móvil"
                  description="Primera versión de la aplicación para seguimiento de pedidos."
                  progress={30}
                  tasksCompleted={6}
                  totalTasks={20}
                />
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-white">
                  Tareas recientes
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Actividades que requieren seguimiento.
                </p>
              </div>

              <div className="mt-4">
                <TaskItem
                  title="Diseñar página de inicio"
                  project="Sitio corporativo"
                  status="En progreso"
                  priority="Alta"
                  dueDate="10 Sep 2026"
                />

                <TaskItem
                  title="Crear tabla de usuarios"
                  project="Panel de clientes"
                  status="Pendiente"
                  priority="Media"
                  dueDate="12 Sep 2026"
                />

                <TaskItem
                  title="Documentar endpoints"
                  project="API de inventario"
                  status="Pendiente"
                  priority="Baja"
                  dueDate="14 Sep 2026"
                />

                <TaskItem
                  title="Configurar navegación principal"
                  project="Aplicación móvil"
                  status="Completada"
                  priority="Alta"
                  dueDate="8 Sep 2026"
                />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}