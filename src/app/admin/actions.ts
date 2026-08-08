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
    console.error("ERRO AO CRIAR PRODUTO:", error);

    redirect(
      `/admin?error=${encodeURIComponent(
        "Não foi possível criar o produto."
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
export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}