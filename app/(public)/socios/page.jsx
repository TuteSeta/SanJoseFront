"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/NavBar";
import NAV_ITEMS from "@/app/components/ui/navItems";

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function Label({ children }) {
  return <div className="text-xs uppercase tracking-wide text-muted">{children}</div>;
}

function Value({ children }) {
  return <div className="text-sm font-semibold text-app">{children}</div>;
}

function memberTypeLabel(member_type) {
  switch (member_type) {
    case "SOCIO_PLENO":
      return { text: "Socio pleno", badge: "Vota" };
    case "SOCIO_DEPORTIVO":
      return { text: "Socio deportivo", badge: "Deportivo" };
    case "SOCIO_SIMPLE":
    default:
      return { text: "Socio simple", badge: "Hincha" };
  }
}

export default function SociosDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { method: "GET" })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;

        if (data?.ok && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
          router.push("/socios/login");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        router.push("/socios/login");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const mt = useMemo(() => memberTypeLabel(user?.member_type), [user?.member_type]);

  const fullName =
    user?.full_name ||
    user?.name ||
    user?.nombre ||
    "Socio Barrio Santo";

  const memberId = user?.member_number; 
  const dni = user?.dni || "-";
  const email = user?.email || "-";

  // placeholders para cuando metas familia / cuotas
  const familyInfo = user?.family_plan
    ? `Plan familiar (${user.family_plan.size} personas)`
    : "No asociado a plan familiar";

  const paymentStatus = user?.payment_status || "Estado de cuota: sin info (próximamente)";

  return (
    <div className="bg-app text-app min-h-dvh">
      <NavBar items={NAV_ITEMS} />

      <section className="mx-auto max-w-7xl px-6 pt-14 pb-16">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 badge">
              <span>Socios</span>
              <span className="opacity-80">•</span>
              <span className="opacity-80">Mi cuenta</span>
            </div>

            <h1 className="mt-4 text-5xl md:text-6xl title">
              Tu credencial
            </h1>

            <p className="mt-3 text-muted max-w-2xl">
              Este panel muestra tu información como socio. Más adelante vas a poder
              ver tu estado de cuota, historial de pagos y —si aplica— la gestión del plan familiar.
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } finally {
                router.push("/socios/login");
                router.refresh();
              }
            }}
            className="btn-outline w-full md:w-auto"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Credencial */}
          <div className="lg:col-span-7">
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-muted">Credencial digital</div>
                  <div className="mt-1 text-2xl font-semibold text-brand">
                    Barrio Santo
                  </div>
                </div>

                <Badge>{mt?.badge || "Socio"}</Badge>
              </div>

              {/* Layout credencial */}
              <div className="mt-6 grid gap-6 md:grid-cols-[140px_1fr] items-start">
                {/* Foto */}
                <div className="flex flex-col items-center gap-3">
                  <div className="h-32 w-32 rounded-2xl border border-app bg-surface flex items-center justify-center overflow-hidden">
                    {/* Placeholder foto */}
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-semibold text-brand">
                          BS
                        </div>
                        <div className="text-[11px] text-muted mt-1">
                          Foto<br />próximamente
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted text-center">
                    La foto se podrá cargar más adelante.
                  </div>
                </div>

                {/* Datos */}
                <div className="grid gap-4">
                  <div>
                    <div className="text-2xl font-semibold">{fullName}</div>
                    <div className="mt-1 text-sm text-muted">{mt?.text || "Socio"}</div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>DNI</Label>
                      <Value>{dni}</Value>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Value className="break-all">{email}</Value>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Código de socio</Label>
                      <Value>{memberId ?? "-"}</Value>
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Value>{user?.is_active ? "Activo" : "Inactivo"}</Value>
                    </div>
                  </div>

                  <div className="card p-4">
                    <div className="text-sm font-semibold">Plan y cuota</div>
                    <div className="mt-2 text-sm text-muted">{familyInfo}</div>
                    <div className="mt-1 text-sm text-muted">{paymentStatus}</div>
                  </div>
                </div>
              </div>

              {/* Footer credencial */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted">
                  * Esta credencial es informativa. La validación oficial se define por el sistema del club.
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn w-full sm:w-auto"
                >
                  Imprimir credencial
                </button>
              </div>
            </div>
          </div>

          {/* Accesos rápidos / panel derecho */}
          <div className="lg:col-span-5">
            <div className="grid gap-6">
              <div className="card p-6">
                <div className="text-lg font-semibold">Accesos rápidos</div>
                <div className="mt-3 grid gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/socios/perfil")}
                    className="btn-outline w-full justify-center"
                  >
                    Ver perfil (próximamente)
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/socios/pagos")}
                    className="btn-outline w-full justify-center"
                  >
                    Pagos / Cuotas (próximamente)
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/socios/familia")}
                    className="btn-outline w-full justify-center"
                  >
                    Plan familiar (próximamente)
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <div className="text-lg font-semibold">Estado de sesión</div>
                <div className="mt-2 text-sm text-muted">
                  {loading
                    ? "Verificando sesión…"
                    : user
                    ? `Sesión activa como ${dni}`
                    : "Sin sesión"}
                </div>

                <div className="mt-4 text-xs text-muted">
                  Si tenés problemas para ingresar, cerrá sesión e iniciá de nuevo.
                </div>
              </div>

              <div className="card p-6">
                <div className="text-lg font-semibold">Novedades</div>
                <div className="mt-2 text-sm text-muted">
                  Este espacio lo podemos conectar a noticias internas del club
                  (cambios de cuotas, asambleas, votaciones, etc.).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
