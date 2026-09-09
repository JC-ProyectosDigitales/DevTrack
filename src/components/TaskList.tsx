"use client";

import { FormEvent, useMemo, useState } from "react";
import TaskItem from "@/components/TaskItem";

type TaskStatus =
  | "Pendiente"
  | "En progreso"
  | "Completada";

type TaskPriority =
  | "Alta"
  | "Media"
  | "Baja";

type Task = {
  id: number;
  title: string;
  project: string;
  projectId: number;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

type Project = {
  id: number;
  name: string;
};

type TaskListProps = {
  initialTasks: Task[];
  projects: Project[];
};

export default function TaskList({
  initialTasks,
  projects,
}: TaskListProps) {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] =
    useState("");

  const [newStatus, setNewStatus] =
    useState<TaskStatus>("Pendiente");

  const [newPriority, setNewPriority] =
    useState<TaskPriority>("Media");

  const [dueDate, setDueDate] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        task.status === status;

      const matchesPriority =
        priority === "all" ||
        task.priority === priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    status,
    priority,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !title.trim() ||
      !projectId ||
      !dueDate
    ) {
      setError(
        "Completa todos los campos obligatorios.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            projectId: Number(projectId),
            status: newStatus,
            priority: newPriority,
            dueDate: new Date(
              `${dueDate}T00:00:00`,
            ).toISOString(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo crear la tarea.",
        );
      }

      const createdTask =
        await response.json();

      const selectedProject =
        projects.find(
          (project) =>
            project.id ===
            Number(projectId),
        );

      if (!selectedProject) {
        throw new Error(
          "No se encontró el proyecto.",
        );
      }

      const newTask: Task = {
        id: createdTask.id,
        title: createdTask.title,
        project: selectedProject.name,
        projectId:
          createdTask.projectId,
        status:
          createdTask.status,
        priority:
          createdTask.priority,
        dueDate:
          createdTask.dueDate,
      };

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

      resetForm();
    } catch {
      setError(
        "Ocurrió un problema al guardar la tarea.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setProjectId("");
    setNewStatus("Pendiente");
    setNewPriority("Media");
    setDueDate("");
    setError("");
    setIsFormOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Todas las tareas
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Revisa el estado, prioridad y fecha límite de cada actividad.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsFormOpen(true)
          }
          disabled={
            projects.length === 0
          }
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Nueva tarea
        </button>
      </div>

      {projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-800 p-6 text-sm text-slate-400">
          Primero debes crear un proyecto antes de agregar tareas.
        </div>
      )}

      {isFormOpen && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Crear tarea
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Agrega la información de la nueva tarea.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Título
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
                placeholder="Ej. Diseñar página de acceso"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="task-project"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Proyecto
              </label>

              <select
                id="task-project"
                value={projectId}
                onChange={(event) =>
                  setProjectId(
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
              >
                <option value="">
                  Selecciona un proyecto
                </option>

                {projects.map(
                  (project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="new-status"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Estado
                </label>

                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(event) =>
                    setNewStatus(
                      event.target
                        .value as TaskStatus,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
                >
                  <option value="Pendiente">
                    Pendiente
                  </option>

                  <option value="En progreso">
                    En progreso
                  </option>

                  <option value="Completada">
                    Completada
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-priority"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Prioridad
                </label>

                <select
                  id="new-priority"
                  value={newPriority}
                  onChange={(event) =>
                    setNewPriority(
                      event.target
                        .value as TaskPriority,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
                >
                  <option value="Alta">
                    Alta
                  </option>

                  <option value="Media">
                    Media
                  </option>

                  <option value="Baja">
                    Baja
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Fecha límite
                </label>

                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-300">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
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
                  : "Crear tarea"}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Buscar
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Buscar por nombre de tarea..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
          />
        </div>

        <div className="md:w-48">
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Estado
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
          >
            <option value="all">
              Todos
            </option>
            <option value="Pendiente">
              Pendiente
            </option>
            <option value="En progreso">
              En progreso
            </option>
            <option value="Completada">
              Completada
            </option>
          </select>
        </div>

        <div className="md:w-48">
          <label
            htmlFor="priority"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Prioridad
          </label>

          <select
            id="priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
          >
            <option value="all">
              Todas
            </option>
            <option value="Alta">
              Alta
            </option>
            <option value="Media">
              Media
            </option>
            <option value="Baja">
              Baja
            </option>
          </select>
        </div>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 px-5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(
            (task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                project={task.project}
                status={task.status}
                priority={task.priority}
                dueDate={
                  new Date(
                    task.dueDate,
                  ).toLocaleDateString(
                    "es-MX",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )
                }
              />
            ),
          )
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            No se encontraron tareas.
          </p>
        )}
      </section>
    </>
  );
}