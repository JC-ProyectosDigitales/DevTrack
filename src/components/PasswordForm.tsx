"use client";

import { FormEvent, useState } from "react";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Las nuevas contraseñas no coinciden.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/profile/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const body = await response.json();

      if (!response.ok) {
        setError(
          typeof body.message === "string"
            ? body.message
            : "No se pudo actualizar la contraseña.",
        );

        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(
        "Contraseña actualizada correctamente.",
      );
    } catch {
      setError(
        "Ocurrió un problema al actualizar la contraseña.",
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
          htmlFor="current-password"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Contraseña actual
        </label>

        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value,
            )
          }
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Nueva contraseña
        </label>

        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(event) =>
            setNewPassword(
              event.target.value,
            )
          }
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-slate-500 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Confirmar nueva contraseña
        </label>

        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value,
            )
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
            ? "Actualizando..."
            : "Actualizar contraseña"}
        </button>
      </div>
    </form>
  );
}