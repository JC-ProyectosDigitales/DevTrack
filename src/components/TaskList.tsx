"use client";

import { useMemo, useState } from "react";
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

const tasks: Task[] = [
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

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
  }, [search, status, priority]);

  return (
    <>
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