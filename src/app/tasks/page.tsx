import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { db } from "@/prisma/db";

export default async function TasksPage() {
  const databaseTasks =
    await db.orm.public.Task.include("project").all();

  const databaseProjects =
    await db.orm.public.Project.all();

  const tasks = databaseTasks.map((task) => ({
    id: task.id,
    title: task.title,
    project: task.project.name,
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
  }));

  const projects = databaseProjects.map((project) => ({
    id: project.id,
    name: project.name,
  }));

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
            />
          </div>
        </section>
      </div>
    </main>
  );
}