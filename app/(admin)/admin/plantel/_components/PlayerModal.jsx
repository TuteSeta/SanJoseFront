"use client";

import { useEffect, useState } from "react";

const POSITIONS = [
  "Base",
  "Escolta",
  "Alero",
  "Ala-Pívot",
  "Pívot",
];

const EMPTY_FORM = {
  branch: "FEMENINO",
  first_name: "",
  last_name: "",
  jersey_number: "",
  position: "",
  birth_date: "",
  height_cm: "",
  photo_path: "",
  bio: "",
  is_captain: false,
  sort_order: "99",
  is_active: true,
};

function Field({ label, children, id }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-white uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[var(--celeste-sanjo)] focus:outline-none focus:ring-1 focus:ring-[var(--celeste-sanjo)] transition";

const selectCls =
  "w-full rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-black cursor-pointer focus:border-[var(--celeste-sanjo)] focus:outline-none focus:ring-1 focus:ring-[var(--celeste-sanjo)] transition";

export default function PlayerModal({ player, defaultBranch = "FEMENINO", onClose, onSaved }) {
  const isEdit = Boolean(player?.id);

  const [form, setForm] = useState(() =>
    player
      ? {
          branch: player.branch ?? "FEMENINO",
          first_name: player.first_name ?? "",
          last_name: player.last_name ?? "",
          jersey_number: player.jersey_number ?? "",
          position: player.position ?? "",
          birth_date: player.birth_date ? player.birth_date.slice(0, 10) : "",
          height_cm: player.height_cm ?? "",
          photo_path: player.photo_path ?? "",
          bio: player.bio ?? "",
          is_captain: player.is_captain ?? false,
          sort_order: String(player.sort_order ?? 99),
          is_active: player.is_active ?? true,
        }
      : { ...EMPTY_FORM, branch: defaultBranch }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function change(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("Nombre y apellido son requeridos.");
      return;
    }

    const payload = {
      ...form,
      jersey_number: form.jersey_number !== "" ? Number(form.jersey_number) : null,
      height_cm: form.height_cm !== "" ? Number(form.height_cm) : null,
      sort_order: form.sort_order !== "" ? Number(form.sort_order) : 99,
      birth_date: form.birth_date || null,
      photo_path: form.photo_path.trim() || null,
      bio: form.bio.trim() || null,
    };

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/senior-squad/${player.id}`
        : "/api/admin/senior-squad";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Error al guardar.");
        return;
      }

      onSaved(data.item);
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1623] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0f1623] px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? "Editar jugador/a" : "Nuevo/a jugador/a"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 px-6 py-5">
          {/* Rama */}
          <div className="col-span-2">
            <Field label="Rama" id="branch">
              <div className="flex gap-2">
                {["FEMENINO", "MASCULINO"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => change("branch", b)}
                    className={[
                      "flex-1 rounded-lg border py-2 text-sm font-medium transition",
                      form.branch === b
                        ? "border-[var(--celeste-sanjo)] bg-[var(--celeste-sanjo)]/20 text-[var(--celeste-sanjo)]"
                        : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {b === "FEMENINO" ? "Femenino ♀" : "Masculino ♂"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Nombre */}
          <Field label="Nombre *" id="first_name">
            <input
              id="first_name"
              className={inputCls}
              value={form.first_name}
              onChange={(e) => change("first_name", e.target.value)}
              placeholder="María"
              required
            />
          </Field>

          {/* Apellido */}
          <Field label="Apellido *" id="last_name">
            <input
              id="last_name"
              className={inputCls}
              value={form.last_name}
              onChange={(e) => change("last_name", e.target.value)}
              placeholder="González"
              required
            />
          </Field>

          {/* Dorsal */}
          <Field label="Dorsal" id="jersey_number">
            <input
              id="jersey_number"
              type="number"
              min={0}
              max={99}
              className={inputCls}
              value={form.jersey_number}
              onChange={(e) => change("jersey_number", e.target.value)}
              placeholder="7"
            />
          </Field>

          {/* Posición */}
          <Field label="Posición" id="position">
            <select
              id="position"
              className={selectCls}
              value={form.position}
              onChange={(e) => change("position", e.target.value)}
            >
              <option value="">— Sin especificar —</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          {/* Fecha nacimiento */}
          <Field label="Fecha de nacimiento" id="birth_date">
            <input
              id="birth_date"
              type="date"
              className={inputCls}
              value={form.birth_date}
              onChange={(e) => change("birth_date", e.target.value)}
            />
          </Field>

          {/* Altura */}
          <Field label="Altura (cm)" id="height_cm">
            <input
              id="height_cm"
              type="number"
              min={100}
              max={250}
              className={inputCls}
              value={form.height_cm}
              onChange={(e) => change("height_cm", e.target.value)}
              placeholder="175"
            />
          </Field>

          {/* Foto URL */}
          <div className="col-span-2">
            <Field label="URL Foto" id="photo_path">
              <input
                id="photo_path"
                type="url"
                className={inputCls}
                value={form.photo_path}
                onChange={(e) => change("photo_path", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>

          {/* Bio */}
          <div className="col-span-2">
            <Field label="Biografía" id="bio">
              <textarea
                id="bio"
                rows={3}
                className={inputCls + " resize-none"}
                value={form.bio}
                onChange={(e) => change("bio", e.target.value)}
                placeholder="Breve descripción del jugador/a..."
              />
            </Field>
          </div>

          {/* Sort order */}
          <Field label="Orden (sort)" id="sort_order">
            <input
              id="sort_order"
              type="number"
              min={0}
              className={inputCls}
              value={form.sort_order}
              onChange={(e) => change("sort_order", e.target.value)}
              placeholder="99"
            />
          </Field>

          {/* Switches */}
          <div className="flex flex-col justify-center gap-3 pl-2">
            <label className="flex cursor-pointer items-center gap-3">
              <span className="relative inline-flex h-5 w-9 shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.is_active}
                  onChange={(e) => change("is_active", e.target.checked)}
                />
                <span className="absolute inset-0 rounded-full bg-white/10 transition peer-checked:bg-[var(--celeste-sanjo)]" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
              </span>
              <span className="text-sm font-medium text-white">Activo/a</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <span className="relative inline-flex h-5 w-9 shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.is_captain}
                  onChange={(e) => change("is_captain", e.target.checked)}
                />
                <span className="absolute inset-0 rounded-full bg-white/10 transition peer-checked:bg-amber-500" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
              </span>
              <span className="text-sm font-medium text-white">Capitán/a</span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm text-white/70 hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[var(--celeste-sanjo)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
            >
              {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear jugador/a"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
