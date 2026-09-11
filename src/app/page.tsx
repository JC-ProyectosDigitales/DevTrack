import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import TaskItem from "@/components/TaskItem";
import { requireUser } from "@/lib/auth";
import { db } from "@/prisma/db";
import Link from "next/link";

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

  const today = new Date();
  
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter((task) => {
    if (task.status === "Completada") {
      return false;
    }

    const dueDate= new Date(task.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }).length;

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const upcomingTasks = tasks
    .filter((task) => task.status !== "Completada")
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
                title="Total de proyectos"
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
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Proyectos recientes
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Seguimiento de los proyectos en los que estás trabajando.
                  </p>
                </div>

                {projects.length > 0 && (
                  <Link
                    href="/projects"
                    className="shrink-0 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Ver todos
                  </Link>
                )}
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
                <div className="rounded-xl border-dashed border-slate-800 p-8 text-center">
                  <h3 className="font-medium text-white">
                    Todavía no tienes proyectos.
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Crea tu primer proyecto para empezar a organizar tus tareas.
                  </p>

                  <Link
                    href="/projects/new"
                    className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
                  >
                    Crear proyecto
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-2 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Próximas tareas
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Tareas pendientes ordenadas por fecha límite.
                  </p>
                </div>

                {tasks.length > 0 && (
                  <Link
                    href="/tasks"
                    className="shrink-0 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Ver todas
                  </Link>
                )}
              </div>

              <div className="mt-4">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => {
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
                  <div className="py-8 text-center">
                    <h3 className="font-medium text-white">
                      No hay tareas pendientes
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {tasks.length === 0
                        ? "Todavía no has creado ninguna tarea."
                        : "Todas tus tareas actuales están completadas."}
                    </p>

                    {projects.length > 0 && (
                      <Link
                        href="/tasks"
                        className="mt-5 inline-flex rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                      >
                        Crear tarea
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}