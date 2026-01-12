"use client";

import MemberTypeCards from "./MemberTypeCards";

export default function FamilyMemberCard({
  index,
  member,
  updateMember,
  responsibleEmail,
  responsibleDni,
}) {
  const isMinor = Boolean(member.is_minor);
  const respEmail = (responsibleEmail ?? "").toString().trim().toLowerCase();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">Miembro #{index + 1}</div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Menor</label>
          <input
            type="checkbox"
            checked={isMinor}
            onChange={(e) => {
              const checked = e.target.checked;


              if (checked) {
                updateMember(index, {
                  ...member,
                  is_minor: true,
                  email: respEmail,
                  responsible_dni: responsibleDni,
                });
              } else {
                updateMember(index, {
                  ...member,
                  is_minor: false,
                  responsible_dni: undefined,
                });
              }
            }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Nombre</label>
          <input
            value={member.first_name || ""}
            onChange={(e) => updateMember(index, { ...member, first_name: e.target.value })}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Nombre"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Apellido</label>
          <input
            value={member.last_name || ""}
            onChange={(e) => updateMember(index, { ...member, last_name: e.target.value })}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Apellido"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">DNI</label>
          <input
            value={member.dni}
            onChange={(e) => updateMember(index, { ...member, dni: e.target.value })}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="DNI"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Email</label>

          {isMinor ? (
            <>
              <input
                value={respEmail}
                disabled
                className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 opacity-70"
                placeholder="email@correo.com"
                type="email"
              />
              <div className="mt-1 text-xs text-muted">
                El menor usa el mismo email del responsable.
              </div>
            </>
          ) : (
            <input
              value={member.email}
              onChange={(e) =>
                updateMember(index, { ...member, email: e.target.value })
              }
              className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
              placeholder="email@correo.com"
              type="email"
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-semibold">Tipo de socio</label>
        <MemberTypeCards
          value={member.member_type}
          onChange={(v) => updateMember(index, { ...member, member_type: v })}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Relación (opcional)</label>
          <input
            value={member.relation}
            onChange={(e) => updateMember(index, { ...member, relation: e.target.value })}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Hijo/a, cónyuge, etc."
          />
        </div>

        {isMinor ? (
          <div>
            <label className="text-sm font-semibold">Contraseña (menor)</label>
            <input
              value={member.password}
              onChange={(e) => updateMember(index, { ...member, password: e.target.value })}
              className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
              placeholder="La define el responsable"
              type="password"
              autoComplete="new-password"
            />
            <div className="mt-1 text-xs text-muted">
              El responsable define la contraseña del menor.
            </div>
          </div>
        ) : (
          <div className="card p-4">
            <div className="text-sm font-semibold">Mayor</div>
            <div className="mt-1 text-xs text-muted">
              La contraseña se definirá por mail (pendiente).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
