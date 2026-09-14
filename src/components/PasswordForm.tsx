"use client";

import {
  FormEvent,
  useState,
} from "react";

export default function PasswordForm() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

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
      setError(
        "Completa todos los campos.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Las nuevas contraseñas no coinciden.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/profile/password",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
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
          className="mb-2 block text-sm font-medium text-text-secondary"
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
          className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="mb-2 block text-sm font-medium text-text-secondary"
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
          className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-medium text-text-secondary"
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
          className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)] disabled:opacity-60"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-danger/25 bg-[var(--danger-soft)] px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl border border-success/25 bg-[var(--success-soft)] px-4 py-3 text-sm text-success">
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
            ? "Actualizando..."
            : "Actualizar contraseña"}
        </button>
      </div>
    </form>
  );
}