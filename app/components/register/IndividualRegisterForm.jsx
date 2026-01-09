"use client";

import Divider from "./Divider";
import MemberTypeCards from "./MemberTypeCards";

export default function IndividualRegisterForm({
  dni, setDni,
  email, setEmail,
  memberType, setMemberType,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  selectedLabelCard,
}) {
  return (
    <>
      <Divider label="Tipo de socio" />
      <MemberTypeCards value={memberType} onChange={setMemberType} />

      <Divider label="Datos" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">DNI</label>
          <input
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="12345678"
            inputMode="numeric"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="tuemail@correo.com"
            type="email"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Contraseña</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Mínimo 8 caracteres"
            type="password"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Confirmar contraseña</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-app bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:rgba(21,28,71,0.18)]"
            placeholder="Repetí tu contraseña"
            type="password"
            autoComplete="new-password"
          />
        </div>
      </div>

      {selectedLabelCard}
    </>
  );
}
