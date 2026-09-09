"use client";

import { FormEvent, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: number;
  name: string;
  description: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
};

type ProjectListProps = {
  initialProjects: Project[];
};

export default function ProjectList({
  initialProjects,
}: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setError("Completa el nombre y la descripción.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: trimmedDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el proyecto.");
      }

      const createdProject = await response.json();

      const newProject: Project = {
        id: createdProject.id,
        name: createdProject.name,
        description: createdProject.description,
        progress: 0,
        tasksCompleted: 0,
        totalTasks: 0,
      };

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ]);

      setName("");
      setDescription("");
      setIsFormOpen(false);
    } catch {
      setError(
        "Ocurrió un problema al guardar el proyecto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    setName("");
    setDescription("");
    setError("");
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Todos los proyectos
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Revisa el progreso y las tareas asociadas a cada proyecto.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          Nuevo proyecto
        </button>
      </div>

      {isFormOpen && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Crear proyecto
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Agrega la información básica del nuevo proyecto.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nombre
              </label>

              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Ej. Portal de proveedores"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Descripción
              </label>

              <textarea
                id="project-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe brevemente el objetivo del proyecto."
                rows={4}
                disabled={isSubmitting}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-300">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Guardando..."
                  : "Crear proyecto"}
              </button>
            </div>
          </form>
        </section>
      )}

      {projects.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              progress={project.progress}
              tasksCompleted={project.tasksCompleted}
              totalTasks={project.totalTasks}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-800 p-10 text-center">
          <h3 className="font-medium text-white">
            No hay proyectos todavía
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Crea tu primer proyecto para comenzar a organizar el trabajo.
          </p>
        </div>
      )}
    </div>
  );
}