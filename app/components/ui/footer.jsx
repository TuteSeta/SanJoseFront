"use client";

import { Mail, Phone, MapPin, Facebook, Instagram, ArrowUpRight } from "lucide-react";

export default function FooterContacto() {
  return (
    <footer className="relative w-full overflow-x-hidden border-t border-slate-800/70 bg-black text-slate-200">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(40rem,100vw)] md:w-[min(60rem,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),rgba(34,197,94,0.12)_40%,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-12">
          <div className="text-center md:col-span-5 md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">Club de Basket San José</h3>
            <p className="mt-3 mx-auto md:mx-0 max-w-lg text-sm md:text-base leading-relaxed text-slate-400">
              Formación, respeto y pasión por el básquet. Sumate a nuestros entrenamientos o escribinos por consultas e inscripciones.
            </p>
          </div>

          {/* Contacto (más ancho) */}
          <div className="order-last md:order-none md:col-span-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ContactItem
                className="md:col-span-2"            
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                href="mailto:ramiromartinez3596@gmail.com"
                value="ramiromartinez3596@gmail.com"
              />
              <ContactItem
                icon={<Phone className="h-4 w-4" />}
                label="WhatsApp"
                href="https://api.whatsapp.com/send?phone=5492617114984"
                value="(261) 7114984"
              />
              <ContactItem
                icon={<MapPin className="h-4 w-4" />}
                label="Ubicación"
                href="https://maps.app.goo.gl/BEwfZmqRqJUWbhEv7"
                value={
                  <span className="inline-flex items-center gap-1">
                    San José, Mendoza, AR
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </span>
                }
              />
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center gap-5 md:col-span-2 md:items-end">
            <div className="flex items-center gap-3">
              <SocialLink href="https://www.facebook.com/profile.php?id=61579710961060&rdid=tJ2xxYwz3L8BlpDP#" label="Facebook del club">
                <Facebook className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/udsjbasquet?igsh=MWg0YXhtOWI1MWFqMw==" label="Instagram del club">
                <Instagram className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-slate-800/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-center text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between md:px-10 md:text-xs">
          <span>© {new Date().getFullYear()} Club de Basket San José. Todos los derechos reservados.</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center justify-center self-center rounded-lg border border-slate-800/80 bg-black px-3 py-2 text-[11px] font-medium text-slate-300 shadow transition hover:border-slate-600 hover:text-white md:self-auto"
          >
            Volver arriba
          </button>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ icon, label, value, href, className = "" }) {
  const external = href?.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={[
        "group flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-black p-4 text-sm shadow transition hover:border-slate-700 hover:bg-slate-900/60",
        className,
      ].join(" ")}
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-800/80 bg-black">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-slate-200 break-words break-all md:break-normal">{value}</p>
      </div>
    </a>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800/80 bg-black text-slate-300 shadow transition hover:scale-[1.03] hover:border-slate-600 hover:text-white"
    >
      {children}
    </a>
  );
}
