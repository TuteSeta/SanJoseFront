"use client";

import { useEffect } from "react";
import Divider from "./Divider";
import MemberTypeCards from "./MemberTypeCards";
import FamilySizePills from "./FamilySizePills";
import FamilyMemberCard from "./FamilyMemberCard";

export default function FamilyRegisterForm({
  rDni, setRDni,
  rEmail, setREmail,
  rFirstName, setRFirstName,
  rLastName, setRLastName,
  rMemberType, setRMemberType,
  rPassword, setRPassword,
  rConfirmPassword, setRConfirmPassword,
  familyCount, setFamilyCount,
  members,
  updateMember,
}) {
  function isMinorMember(m) {
    return Boolean(m?.is_minor ?? m?.isMinor ?? (m?.role === "MINOR") ?? (m?.member_type === "SOCIO_MENOR"));
  }

  useEffect(() => {
    const email = (rEmail ?? "").toString().trim().toLowerCase();
    if (!email) return;

    members.forEach((m, idx) => {
      if (!isMinorMember(m)) return;


      if ((m?.email ?? "").toLowerCase() !== email) {
        updateMember(idx, {
          ...m,
          email,
          is_minor: true,
          responsible_dni: rDni,
        });
      }
    });

  }, [rEmail, rDni]);

  return (
    <>
      <Divider label="Responsable" />

      <div>
        <label className="text-sm font-semibold">Tipo de socio del responsable</label>
        <MemberTypeCards value={rMemberType} onChange={setRMemberType} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Nombre (responsable)</label>
          <input
            value={rFirstName}
            onChange={(e) => setRFirstName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Matías"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Apellido (responsable)</label>
          <input
            value={rLastName}
            onChange={(e) => setRLastName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Zarandón"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">DNI (responsable)</label>
          <input
            value={rDni}
            onChange={(e) => setRDni(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="12345678"
            inputMode="numeric"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Email (responsable)</label>
          <input
            value={rEmail}
            onChange={(e) => setREmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="responsable@correo.com"
            type="email"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Contraseña (responsable)</label>
          <input
            value={rPassword}
            onChange={(e) => setRPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Mínimo 8 caracteres"
            type="password"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Confirmar contraseña</label>
          <input
            value={rConfirmPassword}
            onChange={(e) => setRConfirmPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Repetí la contraseña"
            type="password"
            autoComplete="new-password"
          />
        </div>
      </div>

      <Divider label="Tamaño del plan" />
      <div className="card p-5">
        <div className="text-sm font-semibold">¿Cuántas personas son en total?</div>
        <div className="mt-1 text-sm text-muted">
          Predeterminados: 2, 3 o 4. Si son más, podés poner el número y se aplica descuento según cantidad.
        </div>
        <FamilySizePills
          count={familyCount}
          setCount={(n) => setFamilyCount(Math.max(2, Number(n) || 2))}
        />
      </div>

      <Divider label="Miembros" />
      <div className="grid gap-4">
        {members.map((m, idx) => (
          <FamilyMemberCard
            key={idx}
            index={idx}
            member={m}
            updateMember={updateMember}
            responsibleEmail={rEmail}
            responsibleDni={rDni}
          />
        ))}
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold">Importante</div>
        <div className="mt-2 text-sm text-muted">
          Si un miembro ya es socio, se agrega a la familia sin duplicar cuenta. Si es{" "}
          <span className="font-semibold text-app">socio pleno</span>, puede estar en familia y seguir pagando su aporte pleno.
        </div>
      </div>
    </>
  );
}
