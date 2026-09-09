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

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Sitio corporativo",
    description: "Rediseño y desarrollo del sitio principal de la empresa.",
    progress: 75,
    tasksCompleted: 15,
    totalTasks: 20,
  },
  {
    id: 2,
    name: "Panel de clientes",
    description: "Dashboard para consultar usuarios, actividad y métricas.",
    progress: 45,
    tasksCompleted: 9,
    totalTasks: 20,
  },
  {
    id: 3,
    name: "API de inventario",
    description:
      "Servicio para administrar productos, existencias y movimientos.",
    progress: 60,
    tasksCompleted: 12,
    totalTasks: 20,
  },
  {
    id: 4,
    name: "Aplicación móvil",
    description:
      "Primera versión de la aplicación para seguimiento de pedidos.",
    progress: 30,
    tasksCompleted: 6,
    totalTasks: 20,
  },
  {
    id: 5,
    name: "Portal interno",
    description:
      "Herramienta para consultar documentación y procesos internos.",
    progress: 90,
    tasksCompleted: 18,
    totalTasks: 20,
  },
  {
    id: 6,
    name: "Sistema de reportes",
    description:
      "Módulo para visualizar métricas y generar reportes mensuales.",
    progress: 20,
    tasksCompleted: 4,
    totalTasks: 20,
  },
];

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name: trimmedName,
      description: trimmedDescription,
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
  }

  function handleCancel() {
    setName("");
    setDescription("");
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
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. Portal de proveedores"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
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
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe brevemente el objetivo del proyecto."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
              >
                Crear proyecto
              </button>
            </div>
          </form>
        </section>
      )}

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
    </div>
  );
}