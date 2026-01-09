"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/plantel", label: "Plantel" },
  { href: "/admin/noticias", label: "Noticias" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/socios", label: "Socios" },
  { href: "/admin/empresas", label: "Empresas" },
];

function NavItem({ href, label, active }) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:text-white hover:bg-white/5",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Detectar sesión (solo UI; la seguridad real debe ir en middleware)
  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { method: "GET" })
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.ok) setUser(data.user);
        else setUser(null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/admin/login");
      router.refresh();
    }
  }

  const activeMap = useMemo(() => {
    return NAV.map((item) => ({
      ...item,
      active:
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href)),
    }));
  }, [pathname]);

  // ========= VISTA SIN SESIÓN =========
  // Si no hay sesión, ocultamos TODO (sidebar/topbar/footer) y centramos el children (login)
  if (!loading && !user) {
    return (
      <div className="min-h-dvh bg-[#0b1020] text-white">
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="w-full max-w-lg">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Mientras verifica sesión, opcional: pantalla limpia (sin sidebar)
  if (loading) {
    return (
      <div className="min-h-dvh bg-[#0b1020] text-white flex items-center justify-center px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/70">
          Verificando sesión…
        </div>
      </div>
    );
  }

  // ========= VISTA CON SESIÓN =========
  return (
    <div className="min-h-dvh bg-[#0b1020] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Topbar */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-semibold">
              BS
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">
                Barrio Santo — Admin
              </div>
              <div className="text-xs text-white/60">
                {user?.email} · <span className="uppercase">{user?.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-white text-[#0b1020] px-3 py-2 text-sm font-semibold hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Layout */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="px-2 pb-2 text-xs uppercase tracking-wide text-white/50">
              Secciones
            </div>

            <nav className="space-y-1">
              {activeMap.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={item.active}
                />
              ))}
            </nav>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Tip</div>
              <div className="mt-1 text-sm text-white/80">
                Para cambios sensibles (socios/pagos), usá siempre la cuenta ADMIN.
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:p-6">
            {children}
          </main>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Barrio Santo
        </div>
      </div>
    </div>
  );
}
