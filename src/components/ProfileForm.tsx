"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  initialName: string;
  email: string;
};

export default function ProfileForm({
  initialName,
  email,
}: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("El nombre es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(
          typeof body.message === "string"
            ? body.message
            : "No se pudo actualizar el perfil.",
        );

        return;
      }

      setName(body.name);
      setSuccess("Perfil actualizado correctamente.");

      router.refresh();
    } catch {
      setError(
        "Ocurrió un problema al actualizar el perfil.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="profile-name"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Nombre
        </label>

        <input
          id="profile-name"
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
          htmlFor="profile-email"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Correo electrónico
        </label>

        <input
          id="profile-email"
          type="email"
          value={email}
          disabled
          className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-500 opacity-70"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-300">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-emerald-300">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}