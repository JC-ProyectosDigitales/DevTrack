import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import TaskItem from "@/components/TaskItem";
import { requireUser } from "@/lib/auth";
import { db } from "@/prisma/db";

export default async function Home() {
  const user = await requireUser();

  const projects = await db.orm.public.Project
    .where({
      ownerId: user.id,
    })
    .all();

  const projectIds = projects.map(
    (project) => project.id,
  );

  const allTasks = await db.orm.public.Task.all();

  const tasks = allTasks.filter((task) =>
    projectIds.includes(task.projectId),
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completada",
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "Pendiente" ||
      task.status === "En progreso",
  ).length;

  const now = new Date();

  const overdueTasks = tasks.filter((task) => {
    if (task.status === "Completada") {
      return false;
    }

    return new Date(task.dueDate) < now;
  }).length;

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          userEmail={user.email}
        />

        <section className="flex-1">
          <Header />

          <div className="space-y-8 p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Proyectos activos"
                value={projects.length}
                description="Proyectos registrados"
              />

              <StatCard
                title="Tareas pendientes"
                value={pendingTasks}
                description="Tareas que requieren atención"
              />

              <StatCard
                title="Tareas completadas"
                value={completedTasks}
                description="Tareas finalizadas"
              />

              <StatCard
                title="Tareas vencidas"
                value={overdueTasks}
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

              {recentProjects.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {recentProjects.map((project) => {
                    const projectTasks = tasks.filter(
                      (task) =>
                        task.projectId === project.id,
                    );

                    const completedProjectTasks =
                      projectTasks.filter(
                        (task) =>
                          task.status === "Completada",
                      ).length;

                    const totalTasks =
                      projectTasks.length;

                    const progress =
                      totalTasks > 0
                        ? Math.round(
                            (completedProjectTasks /
                              totalTasks) *
                              100,
                          )
                        : 0;

                    return (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        progress={progress}
                        tasksCompleted={
                          completedProjectTasks
                        }
                        totalTasks={totalTasks}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    Todavía no hay proyectos registrados.
                  </p>
                </div>
              )}
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
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => {
                    const project =
                      projects.find(
                        (project) =>
                          project.id ===
                          task.projectId,
                      );

                    return (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        project={
                          project?.name ??
                          "Proyecto no encontrado"
                        }
                        status={
                          task.status as
                            | "Pendiente"
                            | "En progreso"
                            | "Completada"
                        }
                        priority={
                          task.priority as
                            | "Alta"
                            | "Media"
                            | "Baja"
                        }
                        dueDate={new Date(
                          task.dueDate,
                        ).toLocaleDateString(
                          "es-MX",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      />
                    );
                  })
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Todavía no hay tareas registradas.
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}