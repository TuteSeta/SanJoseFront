"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
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
        body: JSON.stringify({ dni, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.message || "No se pudo iniciar sesión.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-3xl bg-white/5 border border-white/10 p-10 text-white shadow-[0_30px_80px_rgba(0,0,0,.35)]"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-bold">
          BS
        </div>
        <div>
          <h1 className="text-2xl font-semibold leading-tight">Ingresar al Admin</h1>
          <p className="text-sm text-white/70 mt-1">Acceso restringido al club.</p>
        </div>
      </div>

      <label className="block mt-8 text-sm text-white/80">DNI</label>
      <input
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-base"
        placeholder="12345678"
        inputMode="numeric"
        autoComplete="username"
      />

      <label className="block mt-5 text-sm text-white/80">Contraseña</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 outline-none text-base"
        placeholder="••••••••••"
        type="password"
        autoComplete="current-password"
      />

      {error ? <div className="mt-5 text-sm text-red-300">{error}</div> : null}

      <button
        disabled={loading}
        className="mt-7 w-full rounded-2xl bg-white text-[#0b1020] py-3 font-semibold text-base disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
