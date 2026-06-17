import { getCurrentUserId } from "./auth-user";
import { createClient } from "./supabase/client";
import type {
  BillingCycle,
  ChargeCategory,
  RecurringCharge,
  RecurringChargeStatus,
} from "./types";
type RecurringChargeRow = {
  id: string;
  user_id: string;
  app_id: string;
  item_name: string;
  amount: number;
  category: ChargeCategory;
  billing_cycle: BillingCycle;
  interval_days: number | null;
  billing_day: number | null;
  next_billing_date: string;
  status: RecurringChargeStatus;
  created_at: string;
  updated_at: string;
};

function toRecurringCharge(row: RecurringChargeRow): RecurringCharge {
  return {
    id: row.id,
    appId: row.app_id,
    itemName: row.item_name,
    amount: row.amount,
    category: row.category,
    billingCycle: row.billing_cycle,
    nextBillingDate: row.next_billing_date,
    intervalDays: row.interval_days,
    billingDay: row.billing_day,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchRecurringCharges() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recurring_charges")
    .select("*")
    .order("next_billing_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    toRecurringCharge(row as RecurringChargeRow),
  );
}

export async function createRecurringCharge(input: {
  appId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  intervalDays: number | null;
  billingDay: number | null;
}) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("recurring_charges")
    .insert({
      user_id: userId,
      app_id: input.appId,
      item_name: input.itemName,
      amount: input.amount,
      category: input.category,
      billing_cycle: input.billingCycle,
      next_billing_date: input.nextBillingDate,
      interval_days: input.intervalDays,
      billing_day: input.billingDay,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toRecurringCharge(data as RecurringChargeRow);
}

export async function deleteRecurringCharge(recurringChargeId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("recurring_charges")
    .delete()
    .eq("id", recurringChargeId);

  if (error) {
    throw error;
  }
}