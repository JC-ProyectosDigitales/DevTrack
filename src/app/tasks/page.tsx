import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { db } from "@/prisma/db";

type TasksPageProps = {
  searchParams: Promise<{
    projectId?: string;
  }>;
};

export default async function TasksPage({
  searchParams,
}: TasksPageProps) {
  const { projectId } = await searchParams;

  const databaseTasks =
    await db.orm.public.Task.all();

  const databaseProjects =
    await db.orm.public.Project.all();

  const projects = databaseProjects.map(
    (project) => ({
      id: project.id,
      name: project.name,
    }),
  );

  const tasks = databaseTasks.map((task) => {
    const project = databaseProjects.find(
      (project) =>
        project.id === task.projectId,
    );

    return {
      id: task.id,
      title: task.title,
      project:
        project?.name ??
        "Proyecto no encontrado",
      projectId: task.projectId,
      status: task.status as
        | "Pendiente"
        | "En progreso"
        | "Completada",
      priority: task.priority as
        | "Alta"
        | "Media"
        | "Baja",
      dueDate: task.dueDate,
    };
  });

  const initialProjectId =
    projectId &&
    Number.isInteger(Number(projectId))
      ? Number(projectId)
      : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header
            title="Tareas"
            description="Consulta y administra las tareas de tus proyectos."
          />

          <div className="space-y-6 p-8">
            <TaskList
              initialTasks={tasks}
              projects={projects}
              initialProjectId={
                initialProjectId
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}