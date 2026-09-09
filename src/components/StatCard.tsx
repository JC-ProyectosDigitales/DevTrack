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
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </article>
  );
}