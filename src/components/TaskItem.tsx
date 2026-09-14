type TaskItemProps = {
  title: string;
  project: string;
  status:
    | "Pendiente"
    | "En progreso"
    | "Completada";
  priority: "Alta" | "Media" | "Baja";
  dueDate: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const statusStyles = {
  Pendiente:
    "border border-warning/20 bg-[var(--warning-soft)] text-warning",
  "En progreso":
    "border border-accent/20 bg-[var(--accent-soft)] text-accent",
  Completada:
    "border border-success/20 bg-[var(--success-soft)] text-success",
};

const priorityStyles = {
  Alta: "text-danger",
  Media: "text-warning",
  Baja: "text-text-secondary",
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
    <article className="group flex flex-col gap-4 border-b border-border-app py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h3 className="break-words font-medium text-text-primary transition group-hover:text-accent">
          {title}
        </h3>

        <p className="mt-1 break-words text-sm text-text-muted">
          {project}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center md:justify-end">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`w-fit rounded-full px-3 py-1 font-medium ${statusStyles[status]}`}
          >
            {status}
          </span>

          <span className="text-text-secondary">
            Prioridad:{" "}
            <span
              className={`font-medium ${priorityStyles[priority]}`}
            >
              {priority}
            </span>
          </span>

          <span className="text-text-muted">
            {dueDate}
          </span>
        </div>

        {(onEdit || onDelete) && (
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-xl border border-border-app bg-surface-secondary px-3 py-2 text-xs text-text-secondary hover:border-accent/30 hover:bg-[var(--accent-soft)] hover:text-accent"
              >
                Editar
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-xl border border-danger/25 bg-[var(--danger-soft)] px-3 py-2 text-xs text-danger hover:border-danger/40"
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