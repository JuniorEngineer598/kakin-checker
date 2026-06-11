import PageBackground from "../../components/PageBackground";
import { createClient } from "../../lib/supabase/server";
import type {
  App,
  ChargeCategory,
  DefaultAppIconKey,
  RecurringCharge,
  RecurringChargeStatus,
} from "../../lib/types";
import RecurringChargesClient from "./RecurringChargesClient";

type AppRow = {
  id: string;
  user_id: string;
  name: string;
  icon_type: "default" | "upload";
  icon_key: string | null;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
};

type RecurringChargeRow = {
  id: string;
  user_id: string;
  app_id: string;
  item_name: string;
  amount: number;
  category: ChargeCategory;
  next_billing_date: string;
  interval_days: number;
  status: RecurringChargeStatus;
  created_at: string;
  updated_at: string;
};

function toApp(row: AppRow): App {
  return {
    id: row.id,
    name: row.name,
    icon:
      row.icon_type === "upload" && row.icon_url
        ? {
            type: "upload",
            imageUrl: row.icon_url,
          }
        : {
            type: "default",
            key: (row.icon_key ?? "gamepad") as DefaultAppIconKey,
          },
    createdAt: row.created_at,
  };
}

function toRecurringCharge(row: RecurringChargeRow): RecurringCharge {
  return {
    id: row.id,
    appId: row.app_id,
    itemName: row.item_name,
    amount: row.amount,
    category: row.category,
    nextBillingDate: row.next_billing_date,
    intervalDays: row.interval_days,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function RecurringChargesPage() {
  const supabase = await createClient();

  const [appsResult, recurringChargesResult] = await Promise.all([
    supabase.from("apps").select("*").order("created_at", { ascending: true }),
    supabase
      .from("recurring_charges")
      .select("*")
      .order("next_billing_date", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (appsResult.error) {
    throw appsResult.error;
  }

  if (recurringChargesResult.error) {
    throw recurringChargesResult.error;
  }

  const apps = (appsResult.data ?? []).map((row) => toApp(row as AppRow));
  const recurringCharges = (recurringChargesResult.data ?? []).map((row) =>
    toRecurringCharge(row as RecurringChargeRow),
  );

  return (
    <PageBackground className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <RecurringChargesClient
          initialApps={apps}
          initialRecurringCharges={recurringCharges}
        />
      </div>
    </PageBackground>
  );
}