type HeaderProps = {
  title?: string;
  description?: string;
};

export default function Header({
  title = "Dashboard",
  description = "Resumen general de tus proyectos y tareas.",
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 px-8 py-6">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </header>
  );
}