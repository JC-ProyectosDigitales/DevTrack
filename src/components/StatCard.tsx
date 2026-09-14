type StatCardProps = {
  title: string;
  value: number;
  description: string;
};

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border-app bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_12px_40px_var(--accent-soft)]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-soft)] blur-2xl transition group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-text-secondary">
            {title}
          </p>

          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
        </div>

        <p className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          {value}
        </p>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          {description}
        </p>

        <div className="mt-5 h-px bg-gradient-to-r from-accent/40 via-accent-secondary/30 to-transparent" />
      </div>
    </article>
  );
}