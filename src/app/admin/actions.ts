"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function addProduct(formData: FormData) {
  const name = formData.get("name");
  const brand = formData.get("brand");
  const category = formData.get("category");
  const barcode = formData.get("barcode");

  if (typeof name !== "string" || name.trim() === "") {
    redirect("/admin?error=O nome do produto é obrigatório.");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("products")
    .insert({
      name: name.trim(),
      brand:
        typeof brand === "string" && brand.trim() !== ""
          ? brand.trim()
          : null,
      category:
        typeof category === "string" && category.trim() !== ""
          ? category.trim()
          : null,
      barcode:
        typeof barcode === "string" && barcode.trim() !== ""
          ? barcode.trim()
          : null,
    });

  if (error) {
  console.error("ERRO AO CRIAR RECEITA:", error);

  if (error.code === "23505") {
    redirect(
      `/admin?error=${encodeURIComponent(
        "Já existe uma receita com esse nome."
      )}`
    );
  }

  redirect(
    `/admin?error=${encodeURIComponent(
      "Não foi possível criar a receita."
    )}`
  );
}

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin?success=Produto criado com sucesso.");
}
export async function savePrice(formData: FormData) {
  const productId = Number(formData.get("product_id"));
  const supermarketId = Number(formData.get("supermarket_id"));

  const rawPrice = formData.get("price");

  const price =
    typeof rawPrice === "string"
      ? Number(rawPrice.replace(",", "."))
      : NaN;

  const isPromotion = formData.get("is_promotion") === "on";

  const sourceUrl = formData.get("source_url");

  if (
    !Number.isInteger(productId) ||
    !Number.isInteger(supermarketId) ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    redirect("/admin?error=Preenche corretamente o produto, supermercado e preço.");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("product_prices")
    .upsert(
      {
        product_id: productId,
        supermarket_id: supermarketId,
        price,
        is_promotion: isPromotion,
        source_url:
          typeof sourceUrl === "string" && sourceUrl.trim() !== ""
            ? sourceUrl.trim()
            : null,
        observed_at: new Date().toISOString(),
      },
      {
        onConflict: "product_id,supermarket_id",
      }
    );

  if (error) {
    console.error("ERRO AO GUARDAR PREÇO:", error);

    redirect(
      `/admin?error=${encodeURIComponent(
        "Não foi possível guardar o preço."
      )}`
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");

  redirect("/admin?success=Preço guardado com sucesso.");
}
export async function addRecipe(formData: FormData) {
  const name = formData.get("recipe_name");
  const description = formData.get("description");
  const rawServings = formData.get("servings");

  const servings =
    typeof rawServings === "string" && rawServings !== ""
      ? Number(rawServings)
      : null;

  if (typeof name !== "string" || name.trim() === "") {
    redirect("/admin?error=O nome da receita é obrigatório.");
  }

  if (
    servings !== null &&
    (!Number.isInteger(servings) || servings <= 0)
  ) {
    redirect("/admin?error=O número de doses não é válido.");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("recipes")
    .insert({
      name: name.trim(),
      servings,
      description:
        typeof description === "string" &&
        description.trim() !== ""
          ? description.trim()
          : null,
    });

  if (error) {
    console.error("ERRO AO CRIAR RECEITA:", error);

    redirect(
      `/admin?error=${encodeURIComponent(
        "Não foi possível criar a receita."
      )}`
    );
  }

  revalidatePath("/admin");

  redirect("/admin?success=Receita criada com sucesso.");
}


export async function saveRecipeIngredient(formData: FormData) {
  const recipeId = Number(formData.get("recipe_id"));
  const productId = Number(formData.get("ingredient_product_id"));

  const rawQuantity = formData.get("quantity");

  const quantity =
    typeof rawQuantity === "string"
      ? Number(rawQuantity.replace(",", "."))
      : NaN;

  const unit = formData.get("unit");

  if (
    !Number.isInteger(recipeId) ||
    !Number.isInteger(productId) ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    typeof unit !== "string" ||
    !["g", "ml", "un"].includes(unit)
  ) {
    redirect(
      "/admin?error=Preenche corretamente os dados do ingrediente."
    );
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("recipe_ingredients")
    .upsert(
      {
        recipe_id: recipeId,
        product_id: productId,
        quantity,
        unit,
      },
      {
        onConflict: "recipe_id,product_id",
      }
    );

  if (error) {
    console.error("ERRO AO GUARDAR INGREDIENTE:", error);

    redirect(
      `/admin?error=${encodeURIComponent(
        "Não foi possível guardar o ingrediente."
      )}`
    );
  }

  revalidatePath("/admin");

  redirect(
    "/admin?success=Ingrediente guardado com sucesso."
  );
}
export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}