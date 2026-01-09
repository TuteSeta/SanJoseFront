"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import NavBar from "../../../components/ui/NavBar"; // ajustá si cambia
import NAV_ITEMS from "../../../components/ui/navItems"; // ajustá si cambia

import RegisterPageShell from "../../../components/register/RegisterPageShell";
import RegisterModeToggle from "../../../components/register/RegisterModeToggle";
import IndividualRegisterForm from "../../../components/register/IndividualRegisterForm";
import FamilyRegisterForm from "../../../components/register/FamilyRegisterForm";
import Divider from "../../../components/register/Divider";
import { MEMBER_OPTIONS } from "../../../components/register/registerConstants";

export default function SociosRegisterPage() {
  const router = useRouter();
  const items = NAV_ITEMS;

  const [mode, setMode] = useState("INDIVIDUAL");

  // Individual
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [memberType, setMemberType] = useState("SOCIO_SIMPLE");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Family responsible
  const [rDni, setRDni] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rMemberType, setRMemberType] = useState("SOCIO_SIMPLE");
  const [rPassword, setRPassword] = useState("");
  const [rConfirmPassword, setRConfirmPassword] = useState("");

  const [familyCount, setFamilyCount] = useState(2);
  const [members, setMembers] = useState([
    { dni: "", email: "", member_type: "SOCIO_SIMPLE", is_minor: false, password: "", relation: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successNote, setSuccessNote] = useState("");

  const selectedIndividual = useMemo(
    () => MEMBER_OPTIONS.find((o) => o.value === memberType),
    [memberType]
  );

  function syncMembersToCount(nextCount) {
    const target = Math.max(1, nextCount - 1);
    setMembers((prev) => {
      const copy = [...prev];
      if (copy.length < target) {
        while (copy.length < target) {
          copy.push({ dni: "", email: "", member_type: "SOCIO_SIMPLE", is_minor: false, password: "", relation: "" });
        }
      } else if (copy.length > target) {
        copy.length = target;
      }
      return copy;
    });
  }

  // Ajuste cuando cambia familyCount
  useMemo(() => {
    syncMembersToCount(familyCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyCount]);

  function updateMember(index, patch) {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      if (patch.is_minor === false) next[index].password = "";
      return next;
    });
  }

  function validateIndividual() {
    if (!dni.trim()) return "Ingresá tu DNI.";
    if (!email.trim()) return "Ingresá tu email.";
    if (!password) return "Ingresá una contraseña.";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!confirmPassword) return "Confirmá tu contraseña.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return null;
  }

  function validateFamily() {
    if (!rDni.trim()) return "Ingresá el DNI del responsable.";
    if (!rEmail.trim()) return "Ingresá el email del responsable.";
    if (!rPassword || rPassword.length < 8) return "Contraseña del responsable inválida (mínimo 8).";
    if (!rConfirmPassword) return "Confirmá la contraseña del responsable.";
    if (rPassword !== rConfirmPassword) return "Las contraseñas del responsable no coinciden.";
    if (familyCount < 2) return "El plan familiar debe tener al menos 2 personas.";

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.dni.trim()) return `Miembro #${i + 1}: ingresá DNI.`;
      if (!m.email.trim()) return `Miembro #${i + 1}: ingresá email.`;
      if (m.is_minor) {
        if (!m.password || m.password.length < 8)
          return `Miembro #${i + 1}: contraseña inválida (menor, mínimo 8).`;
      }
    }
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessNote("");

    if (mode === "INDIVIDUAL") {
      const msg = validateIndividual();
      if (msg) return setError(msg);

      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dni: dni.trim(),
            email: email.trim(),
            password,
            confirmPassword,
            member_type: memberType,
          }),
        });

        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) return setError(data?.message || "No se pudo registrar.");

        setSuccessNote("Cuenta creada. Ahora podés iniciar sesión.");
        router.push("/socios/login");
        router.refresh();
      } catch {
        setError("Error de red. Intentá de nuevo.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const msg = validateFamily();
    if (msg) return setError(msg);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/family/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responsible: { dni: rDni.trim(), email: rEmail.trim(), password: rPassword, member_type: rMemberType },
          members: members.map((m) => ({
            dni: m.dni.trim(),
            email: m.email.trim(),
            member_type: m.member_type,
            is_minor: Boolean(m.is_minor),
            password: m.is_minor ? m.password : "",
            relation: m.relation?.trim() || null,
          })),
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) return setError(data?.message || "No se pudo crear el plan familiar.");

      const invites = Array.isArray(data?.invites_to_send) ? data.invites_to_send : [];
      setSuccessNote(
        invites.length > 0
          ? `Plan familiar creado. ${invites.length} adulto(s) nuevo(s) deben definir contraseña (mail pendiente).`
          : "Plan familiar creado correctamente."
      );

      router.push("/socios/login");
      router.refresh();
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const leftContent = (
    <>
      <div className="inline-flex items-center gap-2 badge">
        <span>Socios</span>
        <span className="opacity-80">•</span>
        <span className="opacity-80">Alta</span>
      </div>

      <h1 className="mt-4 text-5xl md:text-6xl title">Registrate como socio</h1>

      <p className="mt-4 text-muted text-base leading-relaxed">
        Elegí si querés registrarte de manera individual o crear un plan familiar con varias personas.
      </p>

      <div className="mt-6 card p-5">
        <div className="text-sm font-semibold">¿Qué opción te conviene?</div>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <span className="font-semibold text-app">Individual:</span> ideal si solo te asociás vos.
          </li>
          <li>
            <span className="font-semibold text-app">Plan familiar:</span> una sola cuota para el grupo (con descuentos según cantidad).{" "}
            <span className="text-app font-semibold">
              Socios plenos pueden estar en familia y seguir pagando su aporte pleno.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-6 text-xs text-muted">
        Tip: si un miembro ya es socio, se agrega al plan familiar sin duplicar su cuenta.
      </div>
    </>
  );

  const selectedLabelCard = (
    <div className="card p-5">
      <div className="text-sm font-semibold">Tipo seleccionado</div>
      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-brand">{selectedIndividual?.title}</div>
          <div className="mt-1 text-sm text-muted">{selectedIndividual?.desc}</div>
        </div>
        <div className="badge">{selectedIndividual?.badge}</div>
      </div>
      <div className="mt-4 text-xs text-muted">
        * Los valores de cuota y beneficios pueden variar según la campaña vigente.
      </div>
    </div>
  );

  return (
    <RegisterPageShell items={items} NavBarComponent={NavBar} leftContent={leftContent}>
      <RegisterModeToggle mode={mode} setMode={setMode} />

      <form onSubmit={onSubmit} className="mt-8 grid gap-6">
        {mode === "INDIVIDUAL" ? (
          <IndividualRegisterForm
            dni={dni} setDni={setDni}
            email={email} setEmail={setEmail}
            memberType={memberType} setMemberType={setMemberType}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            selectedLabelCard={selectedLabelCard}
          />
        ) : (
          <>
            <Divider label="Plan familiar" />
            <FamilyRegisterForm
              rDni={rDni} setRDni={setRDni}
              rEmail={rEmail} setREmail={setREmail}
              rMemberType={rMemberType} setRMemberType={setRMemberType}
              rPassword={rPassword} setRPassword={setRPassword}
              rConfirmPassword={rConfirmPassword} setRConfirmPassword={setRConfirmPassword}
              familyCount={familyCount} setFamilyCount={setFamilyCount}
              members={members}
              updateMember={updateMember}
            />
          </>
        )}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successNote ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {successNote}
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button disabled={loading} className="btn w-full sm:w-auto">
            {loading ? (mode === "FAMILY" ? "Creando plan familiar..." : "Creando cuenta...") : (mode === "FAMILY" ? "Crear plan familiar" : "Crear cuenta")}
          </button>

          <div className="text-xs text-muted">Al registrarte aceptás las políticas del club.</div>
        </div>
      </form>
    </RegisterPageShell>
  );
}
