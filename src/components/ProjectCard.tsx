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
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          {id ? (
            <Link
              href={`/projects/${id}`}
              className="break-words text-lg font-semibold text-white hover:text-slate-300"
            >
              {name}
            </Link>
          ) : (
            <h3 className="break-words text-lg font-semibold text-white">
              {name}
            </h3>
          )}

          <p className="mt-1 break-words text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <span className="w-fit shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {progress}%
        </span>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-slate-200"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {tasksCompleted} de {totalTasks} tareas
          </span>

          <span>{progress}% completado</span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-800 pt-4 sm:flex sm:justify-end">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Editar
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-rose-900/70 px-3 py-2 text-sm text-rose-300 hover:bg-rose-950/40"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </article>
  );
}