import Header from "@/components/Header";
import ProfileForm from "@/components/ProfileForm";
import Sidebar from "@/components/Sidebar";
import { requireUser } from "@/lib/auth";
import PasswordForm from "@/components/PasswordForm";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          userName={user.name}
          userEmail={user.email}
        />

        <section className="flex-1">
          <Header
            title="Mi perfil"
            description="Consulta y actualiza la información asociada a tu cuenta."
          />

          <div className="p-8">
            <section className="max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="border-b border-slate-800 pb-5">
                <h2 className="text-xl font-semibold text-white">
                  Información de la cuenta
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Actualiza los datos básicos de tu perfil.
                </p>
              </div>

              <div className="pt-6">
                <ProfileForm
                  initialName={user.name}
                  email={user.email}
                />
              </div>

              <div className="mt-6 border-t border-slate-800 pt-5">
                <p className="text-sm text-slate-500">
                  Miembro desde
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {new Date(
                    user.createdAt,
                  ).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-6 max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="border-b border-slate-800 pb-5">
                <h2 className="text-xl font-semibold text-white">
                Seguridad
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                Cambia la contraseña de acceso a tu cuenta.
                </p>
            </div>

            <div className="pt-6">
                <PasswordForm />
            </div>
        </section>
      </div>
    </main>
  );
}