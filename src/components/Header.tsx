import ThemeToggle from "@/components/ThemeToggle";

type HeaderProps = {
  title?: string;
  description?: string;
};

export default function Header({
  title = "Dashboard",
  description = "Resumen general de tus proyectos y tareas.",
}: HeaderProps) {
  return (
    <header className="border-b border-border-app bg-surface/55 px-4 py-5 backdrop-blur-xl sm:px-6 md:px-8 md:py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-text-muted">
              DevTrack Workspace
            </span>
          </div>

          <h2 className="truncate text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h2>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-text-secondary">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}