"use client";

import { useEffect } from "react";

export default function DeleteConfirm({ player, onCancel, onConfirm, loading }) {
  const name = `${player?.first_name ?? ""} ${player?.last_name ?? ""}`.trim();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1623] p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h2 className="mb-1 text-base font-semibold text-white">Eliminar jugador/a</h2>
        <p className="mb-6 text-sm text-white/60">
          ¿Confirmas que deseas eliminar a{" "}
          <span className="font-medium text-white">{name}</span>? Esta acción
          realiza un borrado lógico (soft delete) y puede revertirse.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition"
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
