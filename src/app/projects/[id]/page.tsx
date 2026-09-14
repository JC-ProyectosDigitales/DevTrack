import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskItem from "@/components/TaskItem";
import { requireUser } from "@/lib/auth";
import { db } from "@/prisma/db";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const user = await requireUser();

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await db.orm.public.Project
    .where({
      id: projectId,
      ownerId: user.id,
    })
    .first();

  if (!project) {
    notFound();
  }

  const tasks = await db.orm.public.Task
    .where({
      projectId: project.id,
    })
    .all();

  const completedTasks = tasks.filter(
    (task) => task.status === "Completada",
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) *
            100,
        )
      : 0;

  return (
    <main className="min-h-screen bg-app text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          userEmail={user.email}
        />

        <section className="min-w-0 flex-1">
          <Header
            title={project.name}
            description={project.description}
          />

          <div className="space-y-6 p-4 pb-24 sm:p-6 sm:pb-24 lg:space-y-8 lg:p-8 lg:pb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent"
              >
                <span aria-hidden="true">
                  ←
                </span>

                Volver a proyectos
              </Link>

              <Link
                href={`/tasks?projectId=${project.id}`}
                className="brand-gradient-bg inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5 sm:w-auto"
              >
                Nueva tarea
              </Link>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
              <article className="group relative overflow-hidden rounded-2xl border border-border-app bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_12px_40px_var(--accent-soft)]">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-soft)] blur-2xl transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-text-secondary">
                      Progreso
                    </p>

                    <span className="mt-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
                  </div>

                  <p className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                    {progress}%
                  </p>

                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className="brand-gradient-bg h-full rounded-full shadow-[0_0_14px_var(--accent-soft)]"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              </article>

              <article className="group relative overflow-hidden rounded-2xl border border-border-app bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-success/30 hover:shadow-[0_12px_40px_var(--success-soft)]">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--success-soft)] blur-2xl transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-text-secondary">
                      Tareas completadas
                    </p>

                    <span className="mt-1 h-2 w-2 rounded-full bg-success shadow-[0_0_12px_var(--success)]" />
                  </div>

                  <p className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                    {completedTasks}
                  </p>

                  <p className="mt-2 text-sm text-text-muted">
                    Actividades finalizadas
                  </p>
                </div>
              </article>

              <article className="group relative overflow-hidden rounded-2xl border border-border-app bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent-secondary/30 hover:shadow-[0_12px_40px_var(--accent-secondary-soft)]">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-secondary-soft)] blur-2xl transition group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-text-secondary">
                      Tareas totales
                    </p>

                    <span className="mt-1 h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_12px_var(--accent-secondary)]" />
                  </div>

                  <p className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                    {totalTasks}
                  </p>

                  <p className="mt-2 text-sm text-text-muted">
                    Actividades registradas
                  </p>
                </div>
              </article>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border-app bg-surface shadow-sm">
              <div className="border-b border-border-app p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />

                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Proyecto
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                  Tareas del proyecto
                </h2>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Actividades asociadas exclusivamente
                  a este proyecto.
                </p>
              </div>

              <div className="px-4 sm:px-5">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      title={task.title}
                      project={project.name}
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
                  ))
                ) : (
                  <div className="py-10 text-center sm:py-12">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-accent">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <path d="M9 11 11 13 15 9" />
                        <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
                      </svg>
                    </div>

                    <h3 className="mt-4 font-medium text-text-primary">
                      Este proyecto todavía no tiene tareas
                    </h3>

                    <p className="mt-2 text-sm text-text-muted">
                      Agrega una tarea para comenzar a
                      registrar el avance del proyecto.
                    </p>

                    <Link
                      href={`/tasks?projectId=${project.id}`}
                      className="brand-gradient-bg mt-5 inline-flex rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5"
                    >
                      Crear primera tarea
                    </Link>
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