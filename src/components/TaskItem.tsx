type TaskItemProps = {
  title: string;
  project: string;
  status: "Pendiente" | "En progreso" | "Completada";
  priority: "Alta" | "Media" | "Baja";
  dueDate: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const statusStyles = {
  Pendiente: "bg-amber-500/10 text-amber-300",
  "En progreso": "bg-sky-500/10 text-sky-300",
  Completada: "bg-emerald-500/10 text-emerald-300",
};

const priorityStyles = {
  Alta: "text-rose-300",
  Media: "text-amber-300",
  Baja: "text-slate-300",
};

export default function TaskItem({
  title,
  project,
  status,
  priority,
  dueDate,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <article className="flex flex-col gap-4 border-b border-slate-800 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-medium text-white">{title}</h3>

        <p className="mt-1 text-sm text-slate-500">
          {project}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`rounded-full px-3 py-1 font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>

        <span className="text-slate-400">
          Prioridad:{" "}
          <span className={priorityStyles[priority]}>
            {priority}
          </span>
        </span>

        <span className="text-slate-500">
          {dueDate}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Editar
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg border border-rose-900/70 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-950/40"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}