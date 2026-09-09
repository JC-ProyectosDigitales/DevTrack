import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
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

          <div className="space-y-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Todos los proyectos
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Revisa el progreso y las tareas asociadas a cada proyecto.
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
              >
                Nuevo proyecto
              </button>
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

              <ProjectCard
                name="Portal interno"
                description="Herramienta para consultar documentación y procesos internos."
                progress={90}
                tasksCompleted={18}
                totalTasks={20}
              />

              <ProjectCard
                name="Sistema de reportes"
                description="Módulo para visualizar métricas y generar reportes mensuales."
                progress={20}
                tasksCompleted={4}
                totalTasks={20}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}