import Link from "next/link";

import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Área administrativa</h1>

        <p>Inicia sessão para gerir produtos e preços.</p>

        {error && (
          <p
            style={{
              padding: "12px",
              background: "#fee2e2",
              borderRadius: "8px",
            }}
          >
            {error}
          </p>
        )}

        <form action={login}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Email
            </label>

            <input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  placeholder="nome@exemplo.pt"
  required
  style={{
    display: "block",
    width: "100%",
    height: "44px",
    padding: "10px 12px",
    marginTop: "6px",
    border: "1px solid #9ca3af",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "16px",
    boxSizing: "border-box",
  }}
/>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Palavra-passe
            </label>

            <input
  id="password"
  name="password"
  type="password"
  autoComplete="current-password"
  placeholder="A tua palavra-passe"
  required
  style={{
    display: "block",
    width: "100%",
    height: "44px",
    padding: "10px 12px",
    marginTop: "6px",
    border: "1px solid #9ca3af",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "16px",
    boxSizing: "border-box",
  }}
/>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 700,
              }}
            >
              Entrar
            </button>
        </form>

        <p style={{ marginBottom: 0, marginTop: "24px" }}>
          <Link href="/">Voltar ao Pricechecker</Link>
        </p>
      </section>
    </main>
  );
}