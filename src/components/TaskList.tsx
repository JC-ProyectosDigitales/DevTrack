"use client";

import { FormEvent, useMemo, useState } from "react";
import TaskItem from "@/components/TaskItem";

type TaskStatus = "Pendiente" | "En progreso" | "Completada";
type TaskPriority = "Alta" | "Media" | "Baja";

type Task = {
  id: number;
  title: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Diseñar página de inicio",
    project: "Sitio corporativo",
    status: "En progreso",
    priority: "Alta",
    dueDate: "10 Sep 2026",
  },
  {
    id: 2,
    title: "Crear tabla de usuarios",
    project: "Panel de clientes",
    status: "Pendiente",
    priority: "Media",
    dueDate: "12 Sep 2026",
  },
  {
    id: 3,
    title: "Documentar endpoints",
    project: "API de inventario",
    status: "Pendiente",
    priority: "Baja",
    dueDate: "14 Sep 2026",
  },
  {
    id: 4,
    title: "Configurar navegación principal",
    project: "Aplicación móvil",
    status: "Completada",
    priority: "Alta",
    dueDate: "8 Sep 2026",
  },
  {
    id: 5,
    title: "Revisar contenido institucional",
    project: "Portal interno",
    status: "En progreso",
    priority: "Media",
    dueDate: "16 Sep 2026",
  },
  {
    id: 6,
    title: "Crear gráfica de ingresos",
    project: "Sistema de reportes",
    status: "Pendiente",
    priority: "Alta",
    dueDate: "18 Sep 2026",
  },
  {
    id: 7,
    title: "Validar formulario de contacto",
    project: "Sitio corporativo",
    status: "Completada",
    priority: "Media",
    dueDate: "7 Sep 2026",
  },
  {
    id: 8,
    title: "Agregar búsqueda de clientes",
    project: "Panel de clientes",
    status: "Pendiente",
    priority: "Baja",
    dueDate: "20 Sep 2026",
  },
];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [newStatus, setNewStatus] = useState<TaskStatus>("Pendiente");
  const [newPriority, setNewPriority] = useState<TaskPriority>("Media");
  const [dueDate, setDueDate] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || task.status === status;

      const matchesPriority =
        priority === "all" || task.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, status, priority]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedProject = project.trim();

    if (!trimmedTitle || !trimmedProject || !dueDate) {
      return;
    }

    const formattedDate = new Date(`${dueDate}T00:00:00`).toLocaleDateString(
      "es-MX",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

    const newTask: Task = {
      id: Date.now(),
      title: trimmedTitle,
      project: trimmedProject,
      status: newStatus,
      priority: newPriority,
      dueDate: formattedDate,
    };

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);

    resetForm();
  }

  function resetForm() {
    setTitle("");
    setProject("");
    setNewStatus("Pendiente");
    setNewPriority("Media");
    setDueDate("");
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
          onClick={() => setIsFormOpen(true)}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          Nueva tarea
        </button>
      </div>

      {isFormOpen && (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Crear tarea
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Agrega la información básica de la nueva tarea.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. Crear formulario de acceso"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="task-project"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Proyecto
              </label>

              <input
                id="task-project"
                type="text"
                value={project}
                onChange={(event) => setProject(event.target.value)}
                placeholder="Ej. Panel de clientes"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
              />
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
                    setNewStatus(event.target.value as TaskStatus)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completada">Completada</option>
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
                    setNewPriority(event.target.value as TaskPriority)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
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
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
              >
                Crear tarea
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
            onChange={(event) => setSearch(event.target.value)}
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
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
          >
            <option value="all">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
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
            onChange={(event) => setPriority(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500"
          >
            <option value="all">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 px-5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              project={task.project}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            No se encontraron tareas con esos filtros.
          </p>
        )}
      </section>
    </>
  );
}