const supermarkets = [
  { name: "Continente", status: "Previsto no MVP" },
  { name: "Pingo Doce / Mercadão", status: "Previsto no MVP" },
];

const features = [
  "Criar e guardar receitas",
  "Associar ingredientes a produtos",
  "Comparar o custo por supermercado",
  "Identificar a compra mais económica",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
      <nav className="flex items-center justify-between border-b border-[var(--border)] pb-5">
        <div>
          <p className="text-xl font-bold tracking-tight">PriceChecker</p>
          <p className="text-sm text-[var(--muted)]">
            Preços claros. Receitas mais económicas.
          </p>
        </div>

        <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold">
          MVP
        </span>
      </nav>

      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand)]">
            Comparador alimentar
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Descobre onde a tua receita fica mais barata.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Adiciona uma receita, associa os ingredientes aos produtos dos
            supermercados e compara o custo total antes de fazeres as compras.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
              type="button"
            >
              Criar primeira receita
            </button>

            <button
              className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 font-bold"
              type="button"
            >
              Ver comparação
            </button>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="rounded-xl border border-[var(--border)] bg-white/80 p-4 text-sm font-semibold shadow-sm"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">Exemplo</p>
              <h2 className="text-2xl font-extrabold">Massa à bolonhesa</h2>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
              Poupa 2,35 €
            </span>
          </div>

          <div className="mt-7 space-y-3">
            {supermarkets.map((supermarket, index) => (
              <div
                key={supermarket.name}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4"
              >
                <div>
                  <p className="font-bold">{supermarket.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {supermarket.status}
                  </p>
                </div>
                <p className="text-xl font-black">
                  {index === 0 ? "8,40 €" : "10,75 €"}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
            Os valores apresentados são apenas ilustrativos. A ligação à base de
            dados será criada nas próximas etapas.
          </p>
        </aside>
      </section>
    </main>
  );
}
