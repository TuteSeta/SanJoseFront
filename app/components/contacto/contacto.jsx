'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const FORMSPREE_URL = "https://formspree.io/f/xldppgbb";

export default function Contacto() {
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const r = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (r.ok) {
        setStatus("ok");
        setMsg("¡Gracias! Tu mensaje fue enviado.");
        form.reset();
      } else {
        const j = await r.json().catch(() => ({}));
        setStatus("err");
        setMsg(j?.errors?.[0]?.message || "Hubo un problema enviando el mensaje.");
      }
    } catch {
      setStatus("err");
      setMsg("No se pudo contactar con el servidor de formularios.");
    }
  }

  return (
    <section className="relative w-full bg-transparent text-app overflow-hidden">
      {/* Radial fondo fijo basado en tokens */}
      <div className="
        pointer-events-none fixed -top-60 left-1/2 h-[100rem] w-[100rem] -translate-x-1/2 rounded-full blur-3xl
        bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--celeste-sanjo)_20%,transparent),color-mix(in_srgb,var(--brand)_10%,transparent)_45%,transparent_75%)]
      " />

      {/* corners decorativos */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-4 top-8 h-16 w-40 rounded-xl border border-app" />
        <div className="absolute right-6 bottom-12 h-16 w-40 rounded-xl border border-app" />
      </div>

      {/* BACK TITLE */}
      <div className="absolute inset-x-0 top-10 flex justify-center select-none opacity-5">
        <h1 className="text-[13rem] font-extrabold tracking-widest leading-none text-brand">CONTACTO</h1>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-20 md:grid-cols-2 md:px-10">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-brand">Ponete en contacto</h2>
          <p className="max-w-md">
            ¿Querés sumarte a entrenar, jugar amistosos, o tenés dudas sobre inscripciones? Escribinos y el Club de Basket <span className="text-celeste font-medium">San José</span> te responde a la brevedad.
          </p>

          <div className="space-y-4">
            <ContactCard icon={<Mail className="h-5 w-5" />} title="Email" value="ramiromartinez3596@gmail.com" href="mailto:ramiromartinez3596@gmail.com" />
            <ContactCard icon={<Phone className="h-5 w-5" />} title="Teléfono" value="(261) 7114984" href="https://api.whatsapp.com/send?phone=5492617114984" />
            <ContactCard icon={<MapPin className="h-5 w-5" />} title="Ubicación" value="San José, Mendoza, AR" href="https://maps.app.goo.gl/BEwfZmqRqJUWbhEv7" />
            <ContactCard icon={<Instagram className="h-5 w-5" />} title="Instagram" value="@sanjosebasket" href="https://www.instagram.com/udsjbasquet?igsh=MWg0YXhtOWI1MWFqMw==" />
          </div>

          {/* Mini horarios */}
          <div className="rounded-2xl border border-app bg-[var(--blanco)] p-4 shadow">
            <p className="text-sm">Horarios de atención</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <li>Lun–Vie</li>
              <li className="text-right">09:00–13:00 / 16:00–20:00</li>
              <li>Sábados</li>
              <li className="text-right">10:00–13:00</li>
            </ul>
          </div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="rounded-3xl border border-app bg-[var(--blanco)] p-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <form onSubmit={onSubmit} className="space-y-3">
              <Field label="Nombre y apellido">
                <input
                  name="Nombre"
                  className="w-full rounded-xl border border-app bg-[var(--blanco)] px-4 py-3 text-app placeholder:text-muted focus:border-[var(--celeste-sanjo)] focus:outline-none focus:ring-2 focus:ring-[var(--celeste-sanjo)] transition"
                  placeholder="Tu nombre" required
                />
              </Field>

              <Field label="Email">
                <input
                  type="email" name="Email"
                  className="w-full rounded-xl border border-app bg-[var(--blanco)] px-4 py-3 text-app placeholder:text-muted focus:border-[var(--celeste-sanjo)] focus:outline-none focus:ring-2 focus:ring-[var(--celeste-sanjo)] transition"
                  placeholder="tu@email.com" required
                />
              </Field>

              <Field label="Mensaje">
                <textarea
                  name="Mensaje"
                  className="w-full rounded-xl border border-app bg-[var(--blanco)] px-4 py-3 text-app placeholder:text-muted focus:border-[var(--celeste-sanjo)] focus:outline-none focus:ring-2 focus:ring-[var(--celeste-sanjo)] transition min-h-[200px] resize-y"
                  placeholder="Contanos en qué podemos ayudarte" required
                />
              </Field>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--celeste-sanjo)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Enviando..." : "Enviar"}
                <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              {/* Estado */}
              {status === "ok" && (
                <p className="flex items-center gap-2 text-sm text-brand">
                  <CheckCircle2 className="h-4 w-4" /> {msg}
                </p>
              )}
              {status === "err" && (
                <p className="flex items-center gap-2 text-sm text-accent">
                  <AlertCircle className="h-4 w-4" /> {msg}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ——— Subcomponentes ——— */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-app">{label}</span>
      {children}
    </label>
  );
}

function ContactCard({ icon, title, value, href }) {
  const HOVER_BG = 'hover:bg-[color-mix(in_srgb,var(--celeste-sanjo)_18%,transparent)]';

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "group flex items-center justify-between gap-4 rounded-2xl",
        "border border-app bg-[var(--blanco)] p-4 shadow transition",
        "hover:border-[var(--brand)]", HOVER_BG
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-app bg-[var(--surface)] text-brand">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted">{title}</p>
          <p className="text-sm text-app">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-brand" />
    </a>
  );
}
