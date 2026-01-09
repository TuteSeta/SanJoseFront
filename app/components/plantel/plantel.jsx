'use client';
import { motion } from 'framer-motion';
import { usePlantel } from '../../../hooks/usePlantel';
import PlayerCard from './PlayerCard';

export default function Plantel() {
  const { jugadoras, loading, error } = usePlantel({
    endpoint: '/api/plantel',
    onlyActivas: true,
  });

  return (
    <section className="relative w-full bg-transparent text-app overflow-hidden">
      <div className="pointer-events-none fixed -top-60 left-1/2 h-[80rem] w-[80rem] -translate-x-1/2 rounded-full hidden md:block blur-3xl
        bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--celeste-sanjo)_16%,transparent),color-mix(in_srgb,var(--brand)_8%,transparent)_45%,transparent_75%)]" />

      <div className="absolute inset-x-0 top-10 hidden md:flex justify-center select-none opacity-5">
        <h1 className="text-[10rem] font-extrabold tracking-widest leading-none text-brand">PLANTEL</h1>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 md:px-10 md:pt-16 md:pb-10">
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
            Jugadoras del Club de Basket <span className="font-medium text-celeste">San José</span>.
          </p>
        </motion.div>

        {loading && <p className="text-sm md:text-base text-app">Cargando plantel…</p>}
        {error && <p className="text-sm md:text-base text-brand">{error}</p>}

        {!loading && !error && jugadoras.length === 0 && (
          <p className="text-sm md:text-base text-app">No hay jugadoras para mostrar.</p>
        )}

        {!loading && !error && jugadoras.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {jugadoras.map((p, idx) => (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
              >
                <PlayerCard {...p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
