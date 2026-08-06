import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
};

type Supermarket = {
  id: number;
  name: string;
  website: string | null;
};

type PriceRow = {
  id: number;
  price: number | string;
  is_promotion: boolean;
  observed_at: string | null;
  products: Product | null;
  supermarkets: Supermarket | null;
};

type ProductGroup = {
  product: Product;
  offers: PriceRow[];
};

const euroFormatter = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

export default async function Home() {
  const { data, error } = await supabase
    .from("product_prices")
    .select(`
      id,
      price,
      is_promotion,
      observed_at,
      products (
        id,
        name,
        brand,
        category
      ),
      supermarkets (
        id,
        name,
        website
      )
    `);

  if (error) {
    return (
      <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <h1>Erro ao carregar preços</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const priceRows = (data ?? []) as unknown as PriceRow[];

  /*
   * Agrupa os preços por produto.
   * Assim, no futuro, poderemos comparar vários produtos.
   */
  const groupsMap = new Map<number, ProductGroup>();

  for (const row of priceRows) {
    if (!row.products || !row.supermarkets) {
      continue;
    }

    const existingGroup = groupsMap.get(row.products.id);

    if (existingGroup) {
      existingGroup.offers.push(row);
    } else {
      groupsMap.set(row.products.id, {
        product: row.products,
        offers: [row],
      });
    }
  }

  const productGroups = Array.from(groupsMap.values()).map((group) => ({
    ...group,
    offers: group.offers.sort(
      (first, second) => Number(first.price) - Number(second.price)
    ),
  }));

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Pricechecker</h1>
      <p>Comparação de preços por supermercado</p>

      {productGroups.length === 0 ? (
        <p>Não foram encontrados preços.</p>
      ) : (
        productGroups.map(({ product, offers }) => (
          <section
            key={product.id}
            style={{
              marginTop: "32px",
              padding: "24px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{product.name}</h2>

            {product.brand && <p>Marca: {product.brand}</p>}

            {product.category && <p>Categoria: {product.category}</p>}

            <h3>Preços encontrados</h3>

            <ul style={{ paddingLeft: "20px" }}>
              {offers.map((offer, index) => {
                const supermarket = offer.supermarkets;

                if (!supermarket) {
                  return null;
                }

                const isCheapest = index === 0;

                return (
                  <li key={offer.id} style={{ marginBottom: "16px" }}>
                    <strong>{supermarket.name}</strong>
                    {" — "}
                    <strong>
                      {euroFormatter.format(Number(offer.price))}
                    </strong>

                    {isCheapest && (
                      <span style={{ marginLeft: "10px" }}>
                        ✓ Mais barato
                      </span>
                    )}

                    {offer.is_promotion && (
                      <span style={{ marginLeft: "10px" }}>
                        Em promoção
                      </span>
                    )}

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

                    {offer.observed_at && (
                      <div style={{ marginTop: "4px", fontSize: "14px" }}>
                        Preço observado em{" "}
                        {new Date(offer.observed_at).toLocaleDateString(
                          "pt-PT"
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}