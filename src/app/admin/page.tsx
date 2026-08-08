import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import {
  addProduct,
  savePrice,
  addRecipe,
  saveRecipeIngredient,
  logout,
} from "./actions";

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const { error, success } = await searchParams;

  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();

  const email =
    typeof authData?.claims?.email === "string"
      ? authData.claims.email
      : "Administrador";

  const { data: products } = await supabase
    .from("products")
    .select("id, name, brand, category")
    .order("id", { ascending: false });
  
  const { data: supermarkets } = await supabase
  .from("supermarkets")
  .select("id, name")
  .order("name", { ascending: true });

  const { data: recipes, error: recipesError } = await supabase
  .from("recipes")
  .select("id, name, servings, description")
  .order("id", { ascending: false });

if (recipesError) {
  console.error("ERRO AO CARREGAR RECEITAS:", recipesError);
}

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

      <p>
        Sessão iniciada como: <strong>{email}</strong>
      </p>

      {success && (
        <p
          style={{
            padding: "12px",
            backgroundColor: "#dcfce7",
            borderRadius: "8px",
          }}
        >
          {success}
        </p>
      )}

      {error && (
        <p
          style={{
            padding: "12px",
            backgroundColor: "#fee2e2",
            borderRadius: "8px",
          }}
        >
          {error}
        </p>
      )}

      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Adicionar produto</h2>

        <form action={addProduct}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Nome *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex.: Arroz agulha 1 kg"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="brand"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Marca
            </label>

            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="Ex.: Cigala"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="category"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Categoria
            </label>

            <input
              id="category"
              name="category"
              type="text"
              placeholder="Ex.: Arroz"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="barcode"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Código de barras
            </label>

            <input
              id="barcode"
              name="barcode"
              type="text"
              placeholder="Opcional"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Adicionar produto
          </button>
        </form>
      </section>
      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Adicionar ou atualizar preço</h2>

        <form action={savePrice}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="product_id"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Produto *
            </label>

            <select
              id="product_id"
              name="product_id"
              required
              defaultValue=""
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <option value="" disabled>
                Seleciona um produto
              </option>

              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                  {product.brand ? ` — ${product.brand}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="supermarket_id"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Supermercado *
            </label>

            <select
              id="supermarket_id"
              name="supermarket_id"
              required
              defaultValue=""
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <option value="" disabled>
                Seleciona um supermercado
              </option>

              {supermarkets?.map((supermarket) => (
                <option key={supermarket.id} value={supermarket.id}>
                  {supermarket.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="price"
              style={{ display: "block", marginBottom: "6px" }}
            >
              Preço (€) *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="Ex.: 1,29"
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>
              <input
                name="is_promotion"
                type="checkbox"
                style={{ marginRight: "8px" }}
              />
              Em promoção
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="source_url"
              style={{ display: "block", marginBottom: "6px" }}
            >
              URL da fonte
            </label>

            <input
              id="source_url"
              name="source_url"
              type="url"
              placeholder="https://..."
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Guardar preço
          </button>
        </form>
      </section>
      
      <section
  style={{
    marginTop: "32px",
    padding: "24px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
  }}
>
  <h2 style={{ marginTop: 0 }}>Adicionar receita</h2>

  <form action={addRecipe}>
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor="recipe_name"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Nome da receita *
      </label>

      <input
        id="recipe_name"
        name="recipe_name"
        required
        placeholder="Ex.: Arroz de frango"
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor="servings"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Número de doses
      </label>

      <input
        id="servings"
        name="servings"
        type="number"
        min="1"
        step="1"
        placeholder="Ex.: 4"
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="description"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Descrição
      </label>

      <textarea
        id="description"
        name="description"
        rows={3}
        placeholder="Descrição opcional da receita"
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />
    </div>

    <button
      type="submit"
      style={{
        padding: "12px 20px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Criar receita
    </button>
  </form>
</section>

<section
  style={{
    marginTop: "32px",
    padding: "24px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
  }}
>
  <h2 style={{ marginTop: 0 }}>Receitas existentes</h2>

  {!recipes || recipes.length === 0 ? (
    <p>Ainda não existem receitas.</p>
  ) : (
    <ul style={{ paddingLeft: "20px" }}>
      {recipes.map((recipe) => (
        <li
          key={recipe.id}
          style={{
            marginBottom: "16px",
          }}
        >
          <strong>{recipe.name}</strong>

          {recipe.servings && (
            <span> — {recipe.servings} doses</span>
          )}

          {recipe.description && (
            <div
              style={{
                marginTop: "4px",
                fontSize: "14px",
              }}
            >
              {recipe.description}
            </div>
          )}
        </li>
      ))}
    </ul>
  )}
</section>

      <section
  style={{
    marginTop: "32px",
    padding: "24px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
  }}
>
  <h2 style={{ marginTop: 0 }}>
    Adicionar ingrediente à receita
  </h2>

  <form action={saveRecipeIngredient}>
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor="recipe_id"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Receita *
      </label>

      <select
        id="recipe_id"
        name="recipe_id"
        required
        defaultValue=""
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        <option value="" disabled>
          Seleciona uma receita
        </option>

        {recipes?.map((recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.name}
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor="ingredient_product_id"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Produto *
      </label>

      <select
        id="ingredient_product_id"
        name="ingredient_product_id"
        required
        defaultValue=""
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        <option value="" disabled>
          Seleciona um produto
        </option>

        {products?.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
            {product.brand ? ` — ${product.brand}` : ""}
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor="quantity"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Quantidade *
      </label>

      <input
        id="quantity"
        name="quantity"
        type="number"
        min="0.01"
        step="0.01"
        required
        placeholder="Ex.: 300"
        style={{
          width: "100%",
          padding: "10px",
        }}
      />
    </div>

    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="unit"
        style={{ display: "block", marginBottom: "6px" }}
      >
        Unidade *
      </label>

      <select
        id="unit"
        name="unit"
        required
        defaultValue=""
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        <option value="" disabled>
          Seleciona a unidade
        </option>

        <option value="g">gramas (g)</option>
        <option value="ml">mililitros (ml)</option>
        <option value="un">unidades (un)</option>
      </select>
    </div>

    <button
      type="submit"
      style={{
        padding: "12px 20px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Guardar ingrediente
    </button>
  </form>
</section>

      <section style={{ marginTop: "40px" }}>
        <h2>Produtos existentes</h2>

        {!products || products.length === 0 ? (
          <p>Ainda não existem produtos.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                style={{ marginBottom: "12px" }}
              >
                <strong>{product.name}</strong>

                {product.brand && <> — {product.brand}</>}

                {product.category && (
                  <> — {product.category}</>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "40px",
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