type HeaderProps = {
  title?: string;
  description?: string;
};

export default function Header({
  title = "Dashboard",
  description = "Resumen general de tus proyectos y tareas.",
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 px-4 py-5 sm:px-6 md:px-8 md:py-6">
      <h2 className="text-xl font-semibold sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </header>
  );
}