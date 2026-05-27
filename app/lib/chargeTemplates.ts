import { getCurrentUserId } from "./auth-user";
import { createClient } from "./supabase/client";
import type { ChargeCategory, ChargeTemplate } from "./types";

type ChargeTemplateRow = {
  id: string;
  user_id: string;
  app_id: string;
  item_name: string;
  amount: number;
  category: ChargeCategory;
  created_at: string;
  updated_at: string;
};

function toChargeTemplate(row: ChargeTemplateRow): ChargeTemplate {
  return {
    id: row.id,
    appId: row.app_id,
    itemName: row.item_name,
    amount: row.amount,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchChargeTemplates() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("charge_templates")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    toChargeTemplate(row as ChargeTemplateRow),
  );
}

export async function createChargeTemplate(input: {
  appId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
}) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("charge_templates")
    .insert({
      user_id: userId,
      app_id: input.appId,
      item_name: input.itemName,
      amount: input.amount,
      category: input.category,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toChargeTemplate(data as ChargeTemplateRow);
}

export async function updateChargeTemplate(
  templateId: string,
  input: {
    itemName: string;
    amount: number;
    category: ChargeCategory;
  },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("charge_templates")
    .update({
      item_name: input.itemName,
      amount: input.amount,
      category: input.category,
      updated_at: new Date().toISOString(),
    })
    .eq("id", templateId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toChargeTemplate(data as ChargeTemplateRow);
}

export async function deleteChargeTemplate(templateId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("charge_templates")
    .delete()
    .eq("id", templateId);

  if (error) {
    throw error;
  }
}