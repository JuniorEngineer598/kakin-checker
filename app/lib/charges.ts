import { createClient } from "./supabase/client";
import type { ChargeCategory, ChargeRecord } from "./types";
import { getCurrentUserId } from "./auth-user";

type ChargeRow = {
  id: string;
  user_id: string;
  app_id: string;
  item_name: string;
  amount: number;
  category: ChargeCategory;
  charged_at: string;
  created_at: string;
  updated_at: string;
};

function toChargeRecord(row: ChargeRow): ChargeRecord {
  return {
    id: row.id,
    gameId: row.app_id,
    itemName: row.item_name,
    amount: row.amount,
    category: row.category,
    chargedAt: row.charged_at,
    createdAt: row.created_at,
  };
}

export async function fetchCharges() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("charges")
    .select("*")
    .order("charged_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toChargeRecord(row as ChargeRow));
}

export async function createCharge(input: {
  appId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
  chargedAt: string;
}) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("charges")
    .insert({
      user_id: userId,
      app_id: input.appId,
      item_name: input.itemName,
      amount: input.amount,
      category: input.category,
      charged_at: input.chargedAt,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toChargeRecord(data as ChargeRow);
}

export async function deleteCharge(chargeId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("charges").delete().eq("id", chargeId);

  if (error) {
    throw error;
  }
}

export async function deleteCharges(chargeIds: string[]) {
  const supabase = createClient();

  const { error } = await supabase
    .from("charges")
    .delete()
    .in("id", chargeIds);

  if (error) {
    throw error;
  }
}