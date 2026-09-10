"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(
          typeof body.message === "string"
            ? body.message
            : "No se pudo crear la cuenta.",
        );

        return;
      }

      router.push("/login");
    } catch {
      setError(
        "Ocurrió un problema al crear la cuenta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Crear cuenta
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Regístrate para comenzar a usar DevTrack.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Nombre
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Correo
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-white hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}