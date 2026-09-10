import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { requireUser } from "@/lib/auth";
import { db } from "@/prisma/db";

type TasksPageProps = {
  searchParams: Promise<{
    projectId?: string;
  }>;
};

export default async function TasksPage({
  searchParams,
}: TasksPageProps) {
  const user = await requireUser();
  const { projectId } = await searchParams;

  const databaseProjects = await db.orm.public.Project
    .where({
      ownerId: user.id,
    })
    .all();

  const projectIds = databaseProjects.map(
    (project) => project.id,
  );

  const databaseTasks = await db.orm.public.Task.all();

  const userTasks = databaseTasks.filter((task) =>
    projectIds.includes(task.projectId),
  );

  const projects = databaseProjects.map((project) => ({
    id: project.id,
    name: project.name,
  }));

  const tasks = userTasks.map((task) => {
    const project = databaseProjects.find(
      (project) => project.id === task.projectId,
    );

    return {
      id: task.id,
      title: task.title,
      project: project?.name ?? "Proyecto no encontrado",
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

  const requestedProjectId = Number(projectId);

  const initialProjectId =
    Number.isInteger(requestedProjectId) &&
    databaseProjects.some(
      (project) => project.id === requestedProjectId,
    )
      ? requestedProjectId
      : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          userEmail={user.email}
        />

        <section className="flex-1">
          <Header
            title="Tareas"
            description="Consulta y administra las tareas de tus proyectos."
          />

          <div className="space-y-6 p-8">
            <TaskList
              initialTasks={tasks}
              projects={projects}
              initialProjectId={initialProjectId}
            />
          </div>
        </section>
      </div>
    </main>
  );
}