"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

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
  initialProjectId?: number | null;
};

export default function TaskList({
  initialTasks,
  projects,
  initialProjectId = null,
}: TaskListProps) {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState("all");
  const [priority, setPriority] =
    useState("all");

  const [isFormOpen, setIsFormOpen] =
    useState(
      initialProjectId !== null,
    );

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<number | null>(null);

  const [title, setTitle] = useState("");

  const [projectId, setProjectId] =
    useState(
      initialProjectId !== null
        ? String(initialProjectId)
        : "",
    );

  const [newStatus, setNewStatus] =
    useState<TaskStatus>("Pendiente");

  const [
    newPriority,
    setNewPriority,
  ] = useState<TaskPriority>("Media");

  const [dueDate, setDueDate] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          );

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

    const trimmedTitle =
      title.trim();

    if (
      !trimmedTitle ||
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
    setSuccess("");

    try {
      const payload = {
        title: trimmedTitle,
        projectId: Number(projectId),
        status: newStatus,
        priority: newPriority,
        dueDate: new Date(
          `${dueDate}T00:00:00`,
        ).toISOString(),
      };

      const endpoint =
        editingTaskId !== null
          ? `/api/tasks/${editingTaskId}`
          : "/api/tasks";

      const method =
        editingTaskId !== null
          ? "PATCH"
          : "POST";

      const response =
        await fetch(endpoint, {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload,
          ),
        });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          typeof data?.message === "string"
            ? data.message
            : editingTaskId !== null
              ? "No se pudo actualizar la tarea."
              : "No se pudo crear la tarea.",
        );
      }

      const savedTask =
        await response.json();

      const selectedProject =
        projects.find(
          (project) =>
            project.id ===
            Number(projectId),
        );

      if (!selectedProject) {
        throw new Error(
          "No se encontró el proyecto seleccionado.",
        );
      }

      const formattedTask: Task = {
        id: savedTask.id,
        title: savedTask.title,
        project:
          selectedProject.name,
        projectId:
          savedTask.projectId,
        status:
          savedTask.status,
        priority:
          savedTask.priority,
        dueDate:
          savedTask.dueDate,
      };

      if (
        editingTaskId !== null
      ) {
        setTasks(
          (currentTasks) =>
            currentTasks.map(
              (task) =>
                task.id ===
                editingTaskId
                  ? formattedTask
                  : task,
            ),
        );

        setSuccess(
          "Tarea actualizada correctamente.",
        );
      } else {
        setTasks(
          (currentTasks) => [
            ...currentTasks,
            formattedTask,
          ],
        );

        setSuccess(
          "Tarea creada correctamente.",
        );
      }

      resetForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un problema al guardar la tarea.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function startCreate() {
    setEditingTaskId(null);
    setTitle("");
    setProjectId("");
    setNewStatus("Pendiente");
    setNewPriority("Media");
    setDueDate("");
    setError("");
    setIsFormOpen(true);
    setSuccess("");
  }

  function startEdit(
    task: Task,
  ) {
    setEditingTaskId(task.id);
    setTitle(task.title);

    setProjectId(
      String(task.projectId),
    );

    setNewStatus(task.status);

    setNewPriority(
      task.priority,
    );

    setSuccess("");

    const date = new Date(
      task.dueDate,
    );

    const localDate =
      new Date(
        date.getTime() -
          date.getTimezoneOffset() *
            60000,
      )
        .toISOString()
        .split("T")[0];

    setDueDate(localDate);
    setError("");
    setIsFormOpen(true);
  }

  async function handleDelete(
    task: Task,
  ) {
    const confirmed =
      window.confirm(
        `¿Quieres eliminar la tarea "${task.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/tasks/${task.id}`,
          {
            method: "DELETE",
          },
        );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          typeof data?.message === "string"
            ? data.message
            : "No se pudo eliminar la tarea.",
        );
      }

      setTasks(
        (currentTasks) =>
          currentTasks.filter(
            (currentTask) =>
              currentTask.id !==
              task.id,
          ),
      );

      setSuccess(
        "Tarea eliminada correctamente.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un problema al eliminar la tarea.",
      );
    }
  }

  function resetForm() {
    setEditingTaskId(null);
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
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              Actividad
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Todas las tareas
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Revisa el estado,
            prioridad y fecha límite de
            cada actividad.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          disabled={
            projects.length === 0
          }
          className="brand-gradient-bg w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
        >
          Nueva tarea
        </button>
      </div>

      {error &&
        !isFormOpen && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-danger/25 bg-[var(--danger-soft)] px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

      {success &&
        !isFormOpen && (
          <p
            role="status"
            aria-live="polite"
            className="rounded-xl border border-success/25 bg-[var(--success-soft)] px-4 py-3 text-sm text-success"
          >
            {success}
          </p>
        )}

      {projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--warning-soft)] text-warning">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 4.3 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>

            <div>
              <p className="font-medium text-text-primary">
                Primero crea un proyecto
              </p>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Necesitas al menos un
                proyecto antes de poder
                agregar tareas.
              </p>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <section className="overflow-hidden rounded-2xl border border-border-app bg-surface shadow-sm">
          <div className="border-b border-border-app p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_10px_var(--accent-secondary)]" />

              <h3 className="text-lg font-semibold text-text-primary">
                {editingTaskId !==
                null
                  ? "Editar tarea"
                  : "Crear tarea"}
              </h3>
            </div>

            <p className="mt-2 text-sm text-text-secondary">
              {editingTaskId !==
              null
                ? "Actualiza la información de la tarea."
                : "Agrega la información de la nueva tarea."}
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5 p-4 sm:p-5"
          >
            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Título
              </label>

              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(
                  event,
                ) =>
                  setTitle(
                    event.target
                      .value,
                  )
                }
                disabled={
                  isSubmitting
                }
                required
                placeholder="Ej. Diseñar página de acceso"
                className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="task-project"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Proyecto
              </label>

              <select
                id="task-project"
                value={projectId}
                onChange={(
                  event,
                ) =>
                  setProjectId(
                    event.target
                      .value,
                  )
                }
                disabled={
                  isSubmitting
                }
                required
                className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
              >
                <option value="">
                  Selecciona un
                  proyecto
                </option>

                {projects.map(
                  (project) => (
                    <option
                      key={
                        project.id
                      }
                      value={
                        project.id
                      }
                    >
                      {
                        project.name
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="new-status"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Estado
                </label>

                <select
                  id="new-status"
                  value={
                    newStatus
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewStatus(
                      event.target
                        .value as TaskStatus,
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
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
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Prioridad
                </label>

                <select
                  id="new-priority"
                  value={
                    newPriority
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewPriority(
                      event.target
                        .value as TaskPriority,
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
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
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Fecha límite
                </label>

                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(
                    event,
                  ) =>
                    setDueDate(
                      event.target
                        .value,
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  required
                  className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
                />
              </div>
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
                onClick={
                  resetForm
                }
                disabled={
                  isSubmitting
                }
                className="rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm font-medium text-text-secondary hover:border-border-strong hover:text-text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="brand-gradient-bg rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isSubmitting
                  ? "Guardando..."
                  : editingTaskId !==
                      null
                    ? "Guardar cambios"
                    : "Crear tarea"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-border-app bg-surface p-4 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              Filtros
            </span>
          </div>

          <p className="mt-2 text-sm text-text-secondary">
            Encuentra rápidamente
            tareas por nombre, estado
            o prioridad.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Buscar
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Buscar por nombre de tarea..."
              className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
            />
          </div>

          <div className="md:w-48">
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Estado
            </label>

            <select
              id="status"
              value={status}
              onChange={(
                event,
              ) =>
                setStatus(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
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
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Prioridad
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(
                event,
              ) =>
                setPriority(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
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
      </section>

      <section className="overflow-hidden rounded-2xl border border-border-app bg-surface px-4 shadow-sm sm:px-5">
        {filteredTasks.length ===
        0 ? (
          <div className="px-4 py-10 text-center sm:px-6 sm:py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M9 11 11 13 15 9" />
                <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
              </svg>
            </div>

            <h3 className="mt-4 text-base font-medium text-text-primary">
              No hay tareas para
              mostrar
            </h3>

            <p className="mt-2 text-sm leading-6 text-text-muted">
              {tasks.length === 0
                ? "Todavía no has creado ninguna tarea."
                : "No hay tareas que coincidan con los filtros seleccionados."}
            </p>

            {tasks.length === 0 &&
              projects.length >
                0 && (
                <button
                  type="button"
                  onClick={
                    startCreate
                  }
                  className="brand-gradient-bg mt-5 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5"
                >
                  Crear primera tarea
                </button>
              )}
          </div>
        ) : (
          filteredTasks.map(
            (task) => (
              <TaskItem
                key={task.id}
                title={
                  task.title
                }
                project={
                  task.project
                }
                status={
                  task.status
                }
                priority={
                  task.priority
                }
                dueDate={new Date(
                  task.dueDate,
                ).toLocaleDateString(
                  "es-MX",
                )}
                onEdit={() =>
                  startEdit(
                    task,
                  )
                }
                onDelete={() =>
                  handleDelete(
                    task,
                  )
                }
              />
            ),
          )
        )}
      </section>
    </>
  );
}