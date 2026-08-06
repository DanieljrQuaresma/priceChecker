import { supabase } from "@/lib/supabase";

type Supermarket = {
  id: number;
  name: string;
  website: string | null;
};

type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  barcode: string | null;
};

export default async function Home() {
  const [supermarketsResult, productsResult] = await Promise.all([
    supabase
      .from("supermarkets")
      .select("id, name, website")
      .order("id", { ascending: true }),

    supabase
      .from("products")
      .select("id, name, brand, category, barcode")
      .order("id", { ascending: true }),
  ]);

  const error = supermarketsResult.error ?? productsResult.error;

  if (error) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <h1>Erro ao carregar os dados</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const supermarkets =
    (supermarketsResult.data ?? []) as Supermarket[];

  const products =
    (productsResult.data ?? []) as Product[];

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Pricechecker</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>Supermercados</h2>

        {supermarkets.length === 0 ? (
          <p>Não foram encontrados supermercados.</p>
        ) : (
          <ul>
            {supermarkets.map((supermarket) => (
              <li key={supermarket.id} style={{ marginBottom: "12px" }}>
                <strong>{supermarket.name}</strong>

                {supermarket.website && (
                  <>
                    {" — "}
                    <a
                      href={supermarket.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visitar site
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Produtos</h2>

        {products.length === 0 ? (
          <p>Não foram encontrados produtos.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.id} style={{ marginBottom: "16px" }}>
                <strong>{product.name}</strong>

                {product.brand && (
                  <div>Marca: {product.brand}</div>
                )}

                {product.category && (
                  <div>Categoria: {product.category}</div>
                )}

                {product.barcode && (
                  <div>Código de barras: {product.barcode}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}