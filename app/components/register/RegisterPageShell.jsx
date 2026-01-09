"use client";

import Link from "next/link";

export default function RegisterPageShell({
  items,
  NavBarComponent,
  leftContent,
  headerRightHref = "/socios",
  children,
  footerHint = "Tip: Usá emails reales, ahí llegan avisos de cuota y novedades.",
}) {
  const NavBar = NavBarComponent;

  return (
    <div className="bg-app text-app min-h-dvh">
      <NavBar items={items} />

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-16">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">{leftContent}</div>

          <div className="lg:col-span-7">
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold">Registro</div>
                  <div className="mt-1 text-sm text-muted">
                    Ya tenés cuenta?{" "}
                    <Link className="text-brand font-semibold" href="/socios/login">
                      Iniciá sesión
                    </Link>
                  </div>
                </div>

                <Link href={headerRightHref} className="btn-outline">
                  Volver
                </Link>
              </div>

              {children}
            </div>

            <div className="mt-4 text-xs text-muted">{footerHint}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
