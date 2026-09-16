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
  const [projects, setProjects] =
    useState<Project[]>(initialProjects);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    editingProjectId,
    setEditingProjectId,
  ] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    if (!trimmedName || !trimmedDescription) {
      setError(
        "Completa el nombre y la descripción.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingProjectId !== null) {
        const response = await fetch(
          `/api/projects/${editingProjectId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: trimmedName,
              description:
                trimmedDescription,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo actualizar el proyecto.",
          );
        }

        const updatedProject =
          await response.json();

        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project.id ===
            editingProjectId
              ? {
                  ...project,
                  name: updatedProject.name,
                  description:
                    updatedProject.description,
                }
              : project,
          ),
        );

        setSuccess(
          "Proyecto actualizado correctamente.",
        );
      } else {
        const response = await fetch(
          "/api/projects",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: trimmedName,
              description:
                trimmedDescription,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo crear el proyecto.",
          );
        }

        const createdProject =
          await response.json();

        const newProject: Project = {
          id: createdProject.id,
          name: createdProject.name,
          description:
            createdProject.description,
          progress: 0,
          tasksCompleted: 0,
          totalTasks: 0,
        };

        setProjects((currentProjects) => [
          ...currentProjects,
          newProject,
        ]);

        setSuccess(
          "Proyecto creado correctamente.",
        );
      }

      resetForm();
    } catch {
      setError(
        "Ocurrió un problema al guardar el proyecto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startCreate() {
    setEditingProjectId(null);
    setName("");
    setDescription("");
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function startEdit(project: Project) {
    setEditingProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  async function handleDelete(
    project: Project,
  ) {
    const confirmed = window.confirm(
      `¿Quieres eliminar el proyecto "${project.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/projects/${project.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const body = await response.json();

        setError(
          typeof body.message === "string"
            ? body.message
            : "No se pudo eliminar el proyecto.",
        );

        return;
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (currentProject) =>
            currentProject.id !==
            project.id,
        ),
      );

      setSuccess(
        "Proyecto eliminado correctamente.",
      );
    } catch {
      setError(
        "Ocurrió un problema al eliminar el proyecto.",
      );
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setEditingProjectId(null);
    setError("");
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              Gestión
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Todos los proyectos
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Revisa el progreso y las tareas asociadas a cada proyecto.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="brand-gradient-bg w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5 sm:w-auto"
        >
          Nuevo proyecto
        </button>
      </div>

      {error && !isFormOpen && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-danger/25 bg-[var(--danger-soft)] px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      {success && !isFormOpen && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl border border-success/25 bg-[var(--success-soft)] px-4 py-3 text-sm text-success"
        >
          {success}
        </p>
      )}

      {isFormOpen && (
        <section className="overflow-hidden rounded-2xl border border-border-app bg-surface shadow-sm">
          <div className="border-b border-border-app p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_10px_var(--accent-secondary)]" />

              <h3 className="text-lg font-semibold text-text-primary">
                {editingProjectId !== null
                  ? "Editar proyecto"
                  : "Crear proyecto"}
              </h3>
            </div>

            <p className="mt-2 text-sm text-text-secondary">
              {editingProjectId !== null
                ? "Actualiza la información del proyecto."
                : "Agrega la información básica del nuevo proyecto."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 sm:p-5"
          >
            <div>
              <label
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Nombre
              </label>

              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                placeholder="Ej. Portal de proveedores"
                disabled={isSubmitting}
                required
                className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Descripción
              </label>

              <textarea
                id="project-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Describe brevemente el objetivo del proyecto."
                rows={4}
                disabled={isSubmitting}
                required
                className="w-full resize-none rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
              />
            </div>

            {error && (
              <p
                role="alert"
                aria-live="polite"
                className="text-sm text-danger"
              >
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 border-t border-border-app pt-4 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm font-medium text-text-secondary hover:border-border-strong hover:text-text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-gradient-bg rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isSubmitting
                  ? "Guardando..."
                  : editingProjectId !== null
                    ? "Guardar cambios"
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
              id={project.id}
              name={project.name}
              description={
                project.description
              }
              progress={project.progress}
              tasksCompleted={
                project.tasksCompleted
              }
              totalTasks={
                project.totalTasks
              }
              onEdit={() =>
                startEdit(project)
              }
              onDelete={() =>
                handleDelete(project)
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 p-6 text-center sm:p-10">
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
            No hay proyectos todavía
          </h3>

          <p className="mt-2 text-sm text-text-muted">
            Crea tu primer proyecto para comenzar a organizar el trabajo.
          </p>

          <button
            type="button"
            onClick={startCreate}
            className="brand-gradient-bg mt-5 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5"
          >
            Crear proyecto
          </button>
        </div>
      )}
    </div>
  );
}