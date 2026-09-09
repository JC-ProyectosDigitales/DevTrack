import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskItem from "@/components/TaskItem";
import { db } from "@/prisma/db";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await db.orm.public.Project.first({
    id: projectId,
  });

  if (!project) {
    notFound();
  }

  const tasks = await db.orm.public.Task
    .where({
      projectId,
    })
    .all();

  const completedTasks = tasks.filter(
    (task) => task.status === "Completada",
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100,
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header
            title={project.name}
            description={project.description}
          />

          <div className="space-y-8 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/projects"
                    className="text-sm text-slate-400 hover:text-white"
                >
                    &larr; Volver a proyectos
                </Link>

                <Link
                    href={`/tasks?projectId=${project.id}`}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium -text-slate-950 hover:bg-slate-200"
                >
                    Nueva tarea
                </Link>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Progreso
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {progress}%
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Tareas completadas
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {completedTasks}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Tareas totales
                </p>

                <p className="mt-3 text-3xl font-semibold text-white">
                  {totalTasks}
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Tareas del proyecto
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Actividades asociadas exclusivamente a este proyecto.
                </p>
              </div>

              <div className="mt-4">
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
                      ).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    />
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Este proyecto todavía no tiene tareas.
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