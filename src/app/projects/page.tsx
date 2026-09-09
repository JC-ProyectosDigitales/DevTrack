import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";
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

          <div className="p-8">
            <ProjectList />
          </div>
        </section>
      </div>
    </main>
  );
}