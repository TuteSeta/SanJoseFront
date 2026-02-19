"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import PlayerModal from "./_components/PlayerModal";
import DeleteConfirm from "./_components/DeleteConfirm";

// ─── helpers ────────────────────────────────────────────────────────────────

function Badge({ children, color = "blue" }) {
  const cls = {
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    green: "bg-green-500/15 text-green-300 border-green-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    gray: "bg-white/5 text-white/40 border-white/10",
  }[color];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

function IconBtn({ title, onClick, children, danger = false, disabled = false }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition",
        danger
          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
          : "border-white/10 text-white/50 hover:bg-white/10 hover:text-white",
        disabled && "opacity-30 pointer-events-none",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

// ─── PlayerRow ───────────────────────────────────────────────────────────────

function PlayerRow({ player, onEdit, onDelete, onToggleActive, onToggleCaptain, onChangeOrder }) {
  const [orderVal, setOrderVal] = useState(String(player.sort_order ?? 99));
  const [savingOrder, setSavingOrder] = useState(false);

  async function commitOrder() {
    const n = Number(orderVal);
    if (isNaN(n) || n === player.sort_order) return;
    setSavingOrder(true);
    await onChangeOrder(player.id, n);
    setSavingOrder(false);
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
      {/* Foto */}
      <td className="px-4 py-3">
        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {player.photo_path ? (
            <Image
              src={player.photo_path}
              alt={`${player.first_name} ${player.last_name}`}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/20 text-[10px]">
              —
            </div>
          )}
        </div>
      </td>

      {/* Nombre */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">
              {player.first_name} {player.last_name}
            </span>
            <span className="text-xs text-white/70">{player.position || "—"}</span>
        </div>
      </td>

      {/* # */}
      <td className="px-3 py-3 text-center">
          <span className="text-sm font-mono text-white">
          {player.jersey_number != null ? `#${player.jersey_number}` : "—"}
        </span>
      </td>

      {/* Capitán */}
      <td className="px-3 py-3 text-center">
        {player.is_captain ? (
          <Badge color="amber">Capitán/a</Badge>
        ) : (
          <span className="text-white/20">—</span>
        )}
      </td>

      {/* Estado */}
      <td className="px-3 py-3 text-center">
        {player.is_active ? (
          <Badge color="green">Activo</Badge>
        ) : (
          <Badge color="gray">Inactivo</Badge>
        )}
      </td>

      {/* Orden */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-14 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white focus:border-[var(--celeste-sanjo)] focus:outline-none"
            value={orderVal}
            onChange={(e) => setOrderVal(e.target.value)}
            onBlur={commitOrder}
            onKeyDown={(e) => e.key === "Enter" && commitOrder()}
            min={0}
          />
          {savingOrder && (
            <svg className="h-3 w-3 animate-spin text-white/40" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
        </div>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {/* Editar */}
          <IconBtn title="Editar" onClick={() => onEdit(player)}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </IconBtn>

          {/* Toggle activo */}
          <IconBtn
            title={player.is_active ? "Desactivar" : "Activar"}
            onClick={() => onToggleActive(player)}
          >
            {player.is_active ? (
              <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </IconBtn>

          {/* Toggle capitán */}
          <IconBtn
            title={player.is_captain ? "Quitar capitanía" : "Marcar capitán/a"}
            onClick={() => onToggleCaptain(player)}
          >
            <svg
              className={`h-4 w-4 ${player.is_captain ? "text-amber-400" : ""}`}
              fill={player.is_captain ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </IconBtn>

          {/* Eliminar */}
          <IconBtn title="Eliminar" onClick={() => onDelete(player)} danger>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </IconBtn>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPlantelPage() {
  const [branch, setBranch] = useState("FEMENINO");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal create/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  // Delete confirm
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchPlayers = useCallback(async (selectedBranch) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/senior-squad?branch=${selectedBranch}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Error al cargar.");
      setPlayers(data.items ?? []);
    } catch (e) {
      setError(e.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers(branch);
  }, [branch, fetchPlayers]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingPlayer(null);
    setModalOpen(true);
  }

  function openEdit(player) {
    setEditingPlayer(player);
    setModalOpen(true);
  }

  function handleSaved(updatedItem) {
    setModalOpen(false);
    setEditingPlayer(null);
    // Refresh list
    fetchPlayers(branch);
  }

  function openDelete(player) {
    setDeletingPlayer(player);
  }

  async function confirmDelete() {
    if (!deletingPlayer) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/senior-squad/${deletingPlayer.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Error al eliminar.");
      setDeletingPlayer(null);
      fetchPlayers(branch);
    } catch (e) {
      alert(e.message || "Error al eliminar.");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function toggleActive(player) {
    try {
      const res = await fetch(`/api/admin/senior-squad/${player.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !player.is_active }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Error.");
      }
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === player.id ? { ...p, is_active: !player.is_active } : p
        )
      );
    } catch (e) {
      alert(e.message || "Error al actualizar.");
    }
  }

  async function toggleCaptain(player) {
    const becomingCaptain = !player.is_captain;
    try {
      const res = await fetch(`/api/admin/senior-squad/${player.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_captain: becomingCaptain }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Error.");
      }
      // Si se convirtió en capitán, quitar al anterior localmente
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === player.id) return { ...p, is_captain: becomingCaptain };
          if (becomingCaptain && p.is_captain) return { ...p, is_captain: false };
          return p;
        })
      );
    } catch (e) {
      alert(e.message || "Error al actualizar.");
    }
  }

  async function changeOrder(id, newOrder) {
    try {
      const res = await fetch(`/api/admin/senior-squad/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: newOrder }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Error.");
      }
      setPlayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, sort_order: newOrder } : p))
      );
    } catch (e) {
      alert(e.message || "Error al cambiar orden.");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Plantel Superior</h1>
            <p className="mt-0.5 text-sm text-white/80">
              Gestión de jugadores/as del plantel mayor.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--celeste-sanjo)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition self-start sm:self-auto"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo/a jugador/a
          </button>
        </div>

        {/* Branch Tabs */}
        <div className="mb-6 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          {["FEMENINO", "MASCULINO"].map((b) => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={[
                "rounded-lg px-5 py-2 text-sm font-semibold transition",
                branch === b
                  ? "bg-white/20 text-white shadow ring-1 ring-white/30"
                  : "text-white/70 hover:text-white hover:bg-white/10",
              ].join(" ")}
            >
              {b === "FEMENINO" ? "♀ Femenino" : "♂ Masculino"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-white/90 py-12 justify-center">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Cargando plantel…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-white/80 text-sm">
              No hay jugadores/as en el plantel {branch.toLowerCase()}.
            </p>
            <button
              onClick={openCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar el primero/a
            </button>
          </div>
        )}

        {!loading && !error && players.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-white/20 bg-white/10 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-4 py-3 w-14">Foto</th>
                  <th className="px-4 py-3">Jugador/a</th>
                  <th className="px-3 py-3 text-center w-16">#</th>
                  <th className="px-3 py-3 text-center w-28">Capitán/a</th>
                  <th className="px-3 py-3 text-center w-24">Estado</th>
                  <th className="px-3 py-3 w-24">Orden</th>
                  <th className="px-4 py-3 w-40">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <PlayerRow
                    key={p.id}
                    player={p}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    onToggleActive={toggleActive}
                    onToggleCaptain={toggleCaptain}
                    onChangeOrder={changeOrder}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <PlayerModal
          player={editingPlayer}
          defaultBranch={branch}
          onClose={() => {
            setModalOpen(false);
            setEditingPlayer(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deletingPlayer && (
        <DeleteConfirm
          player={deletingPlayer}
          loading={deleteLoading}
          onCancel={() => setDeletingPlayer(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
