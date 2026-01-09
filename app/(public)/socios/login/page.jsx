"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/ui/NavBar";
import NAV_ITEMS from "@/app/components/ui/navItems";

export default function SociosLoginPage() {
  const router = useRouter();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: dni.replace(/\D/g, ""), // normalización en front ✔
          password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.message || "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }

      // Login correcto → perfil de socio (lo podés ajustar después)
      router.push("/socios");
      router.refresh();
    } catch {
      setError("Error de red. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-app text-app min-h-dvh">
      <NavBar items={NAV_ITEMS} />

      <main className="mx-auto max-w-lg px-6 pt-24 pb-16">
        <div className="card p-6 sm:p-8">
          <h1 className="title text-3xl text-brand">
            Ingreso de socios
          </h1>

          <p className="mt-2 text-muted">
            Accedé con tu DNI y contraseña para ver tu estado como socio.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold">DNI</label>
              <input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
                placeholder="12345678"
                inputMode="numeric"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="btn w-full mt-2 disabled:opacity-60"
            >
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            ¿Todavía no sos socio?{" "}
            <a href="/socios/register" className="font-semibold">
              Registrate acá
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
