type TaskItemProps = {
  title: string;
  project: string;
  status: "Pendiente" | "En progreso" | "Completada";
  priority: "Alta" | "Media" | "Baja";
  dueDate: string;
};

export default function TaskItem({
  title,
  project,
  status,
  priority,
  dueDate,
}: TaskItemProps) {
  return (
    <article className="flex flex-col gap-4 border-b border-slate-800 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-medium text-white">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">{project}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
          {status}
        </span>

        <span className="text-slate-400">
          Prioridad: <span className="text-slate-200">{priority}</span>
        </span>

        <span className="text-slate-500">{dueDate}</span>
      </div>
    </article>
  );
}