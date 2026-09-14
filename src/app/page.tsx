import Link from "next/link";

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter((task) => {
    if (task.status === "Completada") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
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
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime(),
    )
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-app text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          userEmail={user.email}
        />

        <section className="min-w-0 flex-1">
          <Header />

          <div className="space-y-6 p-4 pb-24 sm:p-6 sm:pb-24 md:space-y-8 md:p-8 md:pb-8">
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
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                      Actividad reciente
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                    Proyectos recientes
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Seguimiento de los proyectos en los
                    que estás trabajando.
                  </p>
                </div>

                {projects.length > 0 && (
                  <Link
                    href="/projects"
                    className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Ver todos
                  </Link>
                )}
              </div>

              {recentProjects.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {recentProjects.map((project) => {
                    const projectTasks =
                      tasks.filter(
                        (task) =>
                          task.projectId ===
                          project.id,
                      );

                    const completedProjectTasks =
                      projectTasks.filter(
                        (task) =>
                          task.status ===
                          "Completada",
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
                        description={
                          project.description
                        }
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
                <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 p-6 text-center sm:p-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4L11 6h7.5A1.5 1.5 0 0 1 20 7.5v10A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-12Z" />
                    </svg>
                  </div>

                  <h3 className="mt-4 font-medium text-text-primary">
                    Todavía no tienes proyectos
                  </h3>

                  <p className="mt-2 text-sm text-text-muted">
                    Crea tu primer proyecto para
                    empezar a organizar tus tareas.
                  </p>

                  <Link
                    href="/projects"
                    className="brand-gradient-bg mt-5 inline-flex rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5"
                  >
                    Crear proyecto
                  </Link>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-border-app bg-surface shadow-sm">
              <div className="border-b border-border-app p-4 sm:p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />

                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                        Seguimiento
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                      Próximas tareas
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      Tareas pendientes ordenadas por
                      fecha límite.
                    </p>
                  </div>

                  {tasks.length > 0 && (
                    <Link
                      href="/tasks"
                      className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover"
                    >
                      Ver todas
                    </Link>
                  )}
                </div>
              </div>

              <div className="px-4 sm:px-5">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => {
                    const project = projects.find(
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
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-success">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </div>

                    <h3 className="mt-4 font-medium text-text-primary">
                      No hay tareas pendientes
                    </h3>

                    <p className="mt-2 text-sm text-text-muted">
                      {tasks.length === 0
                        ? "Todavía no has creado ninguna tarea."
                        : "Todas tus tareas actuales están completadas."}
                    </p>

                    {projects.length > 0 && (
                      <Link
                        href="/tasks"
                        className="mt-5 inline-flex rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm font-medium text-text-secondary hover:border-accent/30 hover:bg-[var(--accent-soft)] hover:text-accent"
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