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

  const [name, setName] =
    useState(initialName);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError(
        "El nombre es obligatorio.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
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
            : "No se pudo actualizar el perfil.",
        );

        return;
      }

      setName(body.name);

      setSuccess(
        "Perfil actualizado correctamente.",
      );

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
          className="mb-2 block text-sm font-medium text-text-secondary"
        >
          Nombre
        </label>

        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value,
            )
          }
          disabled={isSubmitting}
          required
          className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="mb-2 block text-sm font-medium text-text-secondary"
        >
          Correo electrónico
        </label>

        <input
          id="profile-email"
          type="email"
          value={email}
          disabled
          className="w-full cursor-not-allowed rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-muted opacity-70"
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

      {success && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl border border-success/25 bg-[var(--success-soft)] px-4 py-3 text-sm text-success"
        >
          {success}
        </p>
      )}

      <div className="flex justify-end border-t border-border-app pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="brand-gradient-bg w-full rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_var(--accent-soft)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:ml-auto sm:w-auto"
        >
          {isSubmitting
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}