"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PlayerCard from "../../components/plantel/PlayerCard";

export default function PlantelTabs({ femenino = [], masculino = [] }) {
  const [branch, setBranch] = useState(
    femenino.length > 0 ? "FEMENINO" : "MASCULINO"
  );

  const players = branch === "FEMENINO" ? femenino : masculino;

  const hasBoth = femenino.length > 0 && masculino.length > 0;
  const hasEither = femenino.length > 0 || masculino.length > 0;

  return (
    <section className="relative w-full bg-transparent text-app overflow-hidden">
      {/* decorative glow */}
      <div className="pointer-events-none fixed -top-60 left-1/2 h-[80rem] w-[80rem] -translate-x-1/2 rounded-full hidden md:block blur-3xl
        bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--celeste-sanjo)_16%,transparent),color-mix(in_srgb,var(--brand)_8%,transparent)_45%,transparent_75%)]" />

      <div className="absolute inset-x-0 top-10 hidden md:flex justify-center select-none opacity-5">
        <h1 className="text-[10rem] font-extrabold tracking-widest leading-none text-brand">PLANTEL</h1>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 md:px-10 md:pt-16 md:pb-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 md:mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-app bg-[var(--blanco)] px-2.5 py-0.5 text-xs shadow md:px-3 md:py-1 md:text-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--celeste-sanjo)]" />
            Plantel temporada 24/25
          </div>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand md:mt-3 md:text-4xl">
            Nuestro equipo
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-app md:text-base">
            Jugadores/as del Club de Basket{" "}
            <span className="font-medium text-celeste">San José</span>.
          </p>
        </motion.div>

        {/* Branch Tabs — solo si hay los dos */}
        {hasBoth && (
          <div className="mb-6 inline-flex rounded-xl border border-app bg-[var(--blanco)] p-1 shadow-sm">
            {["FEMENINO", "MASCULINO"].map((b) => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                className={[
                  "rounded-lg px-5 py-2 text-sm font-medium transition",
                  branch === b
                    ? "bg-[var(--celeste-sanjo)] text-white shadow"
                    : "text-app hover:text-brand",
                ].join(" ")}
              >
                {b === "FEMENINO" ? "♀ Femenino" : "♂ Masculino"}
              </button>
            ))}
          </div>
        )}

        {/* Player Grid */}
        {!hasEither ? (
          <p className="text-sm md:text-base text-app">No hay jugadores/as para mostrar.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {players.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <PlayerCard
                  nombre={p.nombre}
                  dorsal={p.dorsal}
                  posicion={p.posicion}
                  imagen_url={p.imagen_url}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
