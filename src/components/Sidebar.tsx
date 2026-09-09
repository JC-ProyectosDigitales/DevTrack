"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Proyectos",
    href: "/projects",
  },
  {
    label: "Tareas",
    href: "/tasks",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6">
      <h1 className="text-2xl font-bold tracking-tight">DevTrack</h1>

      <nav className="mt-10 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-slate-800 font-medium text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}