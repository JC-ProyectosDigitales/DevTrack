type ProjectCardProps = {
  name: string;
  description: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
};

export default function ProjectCard({
  name,
  description,
  progress,
  tasksCompleted,
  totalTasks,
}: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {progress}%
        </span>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-slate-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>
            {tasksCompleted} de {totalTasks} tareas
          </span>

          <span>{progress}% completado</span>
        </div>
      </div>
    </article>
  );
}