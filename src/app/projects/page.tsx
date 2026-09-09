import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";
import Sidebar from "@/components/Sidebar";
import { db } from "@/prisma/db";

export default async function ProjectsPage() {
  const databaseProjects = await db.orm.public.Project.all();
  const databaseTasks = await db.orm.public.Task.all();

  const projects = databaseProjects.map((project) => {
    const projectTasks = databaseTasks.filter(
      (task) => task.projectId === project.id,
    );

    const completedTasks = projectTasks.filter(
      (task) => task.status === "Completada",
    ).length;

    const totalTasks = projectTasks.length;

    const progress =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      progress,
      tasksCompleted: completedTasks,
      totalTasks,
    };
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1">
          <Header
            title="Proyectos"
            description="Consulta y administra todos tus proyectos."
          />

          <div className="p-8">
            <ProjectList initialProjects={projects} />
          </div>
        </section>
      </div>
    </main>
  );
}