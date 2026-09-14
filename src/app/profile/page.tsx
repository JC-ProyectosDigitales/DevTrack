import Header from "@/components/Header";
import PasswordForm from "@/components/PasswordForm";
import ProfileForm from "@/components/ProfileForm";
import Sidebar from "@/components/Sidebar";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-app text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          userEmail={user.email}
        />

        <section className="min-w-0 flex-1">
          <Header
            title="Mi perfil"
            description="Consulta y actualiza la información asociada a tu cuenta."
          />

          <div className="space-y-6 p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 md:pb-8">
            <section className="max-w-2xl overflow-hidden rounded-2xl border border-border-app bg-surface shadow-sm">
              <div className="border-b border-border-app p-4 sm:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />

                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Cuenta
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                  Información de la cuenta
                </h2>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Actualiza los datos básicos de tu
                  perfil.
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <ProfileForm
                  initialName={user.name}
                  email={user.email}
                />
              </div>

              <div className="border-t border-border-app bg-surface-secondary px-4 py-4 sm:px-6">
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                  Miembro desde
                </p>

                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {new Date(
                    user.createdAt,
                  ).toLocaleDateString(
                    "es-MX",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
            </section>

            <section className="max-w-2xl overflow-hidden rounded-2xl border border-border-app bg-surface shadow-sm">
              <div className="border-b border-border-app p-4 sm:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_10px_var(--accent-secondary)]" />

                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Seguridad
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                  Contraseña
                </h2>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Cambia la contraseña de acceso a tu
                  cuenta.
                </p>
              </div>

              <div className="p-4 sm:p-6">
                <PasswordForm />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}