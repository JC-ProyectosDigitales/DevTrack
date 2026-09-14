import Link from "next/link";

type ProjectCardProps = {
  id?: number;
  name: string;
  description: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProjectCard({
  id,
  name,
  description,
  progress,
  tasksCompleted,
  totalTasks,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border-app bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_14px_45px_var(--accent-soft)] sm:p-5">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--accent-secondary-soft)] blur-3xl transition group-hover:scale-125" />

      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            {id ? (
              <Link
                href={`/projects/${id}`}
                className="break-words text-lg font-semibold text-text-primary transition hover:text-accent"
              >
                {name}
              </Link>
            ) : (
              <h3 className="break-words text-lg font-semibold text-text-primary">
                {name}
              </h3>
            )}

            <p className="mt-1 break-words text-sm leading-6 text-text-secondary">
              {description}
            </p>
          </div>

          <span className="w-fit shrink-0 rounded-full border border-accent/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-accent">
            {progress}%
          </span>
        </div>

        <div className="mt-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="brand-gradient-bg h-full rounded-full shadow-[0_0_14px_var(--accent-soft)]"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex flex-col gap-1 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              {tasksCompleted} de {totalTasks} tareas
            </span>

            <span>{progress}% completado</span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border-app pt-4 sm:flex sm:justify-end">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-xl border border-border-app bg-surface-secondary px-3 py-2 text-sm text-text-secondary hover:border-accent/30 hover:bg-[var(--accent-soft)] hover:text-accent"
              >
                Editar
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-xl border border-danger/25 bg-[var(--danger-soft)] px-3 py-2 text-sm text-danger hover:border-danger/40"
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