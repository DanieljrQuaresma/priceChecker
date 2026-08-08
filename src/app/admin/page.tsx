import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { logout } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const email =
    typeof data?.claims?.email === "string"
      ? data.claims.email
      : "Administrador";

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Administração do Pricechecker</h1>

      <p>Sessão iniciada como:</p>
      <p>
        <strong>{email}</strong>
      </p>

      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Gestão</h2>

        <p>A área de inserção de produtos e preços será criada aqui.</p>
      </section>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "32px",
        }}
      >
        <Link href="/">Ver aplicação pública</Link>

        <form action={logout}>
          <button type="submit" style={{ cursor: "pointer" }}>
            Terminar sessão
          </button>
        </form>
      </div>
    </main>
  );
}