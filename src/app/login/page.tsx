"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const body =
        await response.json();

      if (!response.ok) {
        setError(
          typeof body.message ===
            "string"
            ? body.message
            : "No se pudo iniciar sesión.",
        );

        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Ocurrió un problema al iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-app px-4 py-10 text-text-primary sm:px-6">
      <div
        className="pointer-events-none absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[var(--accent-soft)] blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-[-140px] right-[-100px] h-96 w-96 rounded-full bg-[var(--accent-secondary-soft)] blur-3xl"
        aria-hidden="true"
      />

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border-app bg-surface/90 backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]"
        style={{
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <section className="relative hidden overflow-hidden border-r border-border-app bg-surface-secondary p-10 md:flex md:flex-col md:justify-between">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, var(--accent-soft), transparent 35%), radial-gradient(circle at 80% 80%, var(--accent-secondary-soft), transparent 40%)",
            }}
            aria-hidden="true"
          />

          <div className="relative">
            <Link
              href="/login"
              className="inline-flex items-center gap-3"
            >
              <div className="brand-gradient-bg flex h-12 w-12 items-center justify-center rounded-2xl shadow-[0_0_30px_var(--accent-soft)]">
                <span className="text-xl font-bold text-white">
                  D
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                  Dev
                  <span className="brand-gradient">
                    Track
                  </span>
                </h1>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-text-muted">
                  Workspace
                </p>
              </div>
            </Link>

            <div className="mt-14 max-w-sm">
              <span className="inline-flex rounded-full border border-accent/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-accent">
                Project Management
              </span>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">
                Organiza.
                <br />
                Construye.
                <br />
                <span className="brand-gradient">
                  Avanza.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-text-secondary">
                Gestiona proyectos, tareas y progreso
                desde un espacio diseñado para mantener
                el trabajo claro y bajo control.
              </p>
            </div>
          </div>

          <div className="relative mt-12 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border-app bg-surface/70 p-4">
              <span className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />

              <p className="mt-3 text-xs text-text-muted">
                Proyectos
              </p>
            </div>

            <div className="rounded-2xl border border-border-app bg-surface/70 p-4">
              <span className="block h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_10px_var(--accent-secondary)]" />

              <p className="mt-3 text-xs text-text-muted">
                Tareas
              </p>
            </div>

            <div className="rounded-2xl border border-border-app bg-surface/70 p-4">
              <span className="block h-2 w-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />

              <p className="mt-3 text-xs text-text-muted">
                Progreso
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-8 md:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 md:hidden">
              <Link
                href="/login"
                className="inline-flex items-center gap-3"
              >
                <div className="brand-gradient-bg flex h-10 w-10 items-center justify-center rounded-xl">
                  <span className="font-bold text-white">
                    D
                  </span>
                </div>

                <h1 className="text-xl font-bold tracking-tight text-text-primary">
                  Dev
                  <span className="brand-gradient">
                    Track
                  </span>
                </h1>
              </Link>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Acceso seguro
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
                Iniciar sesión
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Accede a tu espacio de trabajo en
                DevTrack.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Correo
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-3 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-danger/25 bg-[var(--danger-soft)] px-4 py-3 text-sm text-danger"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-gradient-bg w-full rounded-xl px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_var(--accent-soft)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isSubmitting
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-text-secondary">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-accent hover:text-accent-hover"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}