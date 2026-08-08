"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    password === ""
  ) {
    redirect("/login?error=Preenche o email e a palavra-passe.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
  console.error("ERRO LOGIN SUPABASE:", {
    message: error.message,
    code: error.code,
    status: error.status,
    name: error.name,
  });

  redirect("/login?error=Email ou palavra-passe incorretos.");
}

  revalidatePath("/", "layout");
  redirect("/admin");
}