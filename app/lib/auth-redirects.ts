import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function redirectIfAuthenticated() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/dashboard");
  }
}