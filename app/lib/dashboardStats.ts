import { parseChargeDate } from "./format";
import type { ChargeRecord, App, AppIcon } from "./types";


export type AppChargeTotal = {
  appId: string;
  appName: string;
  appIcon: AppIcon;
  totalAmount: number;
};

export type DashboardStats = {
  appCount: number;
  monthlyChargeCount: number;
  monthlyTotalAmount: number;
  yearlyTotalAmount: number;
  monthlyTopApp: AppChargeTotal | null;
  yearlyTopApp: AppChargeTotal | null;
  monthlyAppTotals: AppChargeTotal[];
};

export function buildDashboardStats(charges: ChargeRecord[], apps: App[]): DashboardStats {
  const today = new Date();

  // 今月の課金記録をフィルタリング
  const monthlyCharges = charges.filter((charge) => {
    // chargedAtをDateオブジェクトに変換して下記で使いやすく
    const chargeDate = parseChargeDate(charge.chargedAt);

    return (
      chargeDate.getFullYear() === today.getFullYear() &&
      chargeDate.getMonth() === today.getMonth()
    );
  });

  // 今年の課金記録をフィルタリング
  const yearlyCharges = charges.filter((charge) => {
    const chargeDate = parseChargeDate(charge.chargedAt);

    return chargeDate.getFullYear() === today.getFullYear();
  });
  
  const monthlyChargeCount = monthlyCharges.length;

  const monthlyTotalAmount = monthlyCharges.reduce((total, charge) => {
    return total + charge.amount;
  }, 0);

  const yearlyTotalAmount = yearlyCharges.reduce((total, charge) => {
    return total + charge.amount;
  }, 0);

  const monthlyAppTotals = buildAppChargeTotals(monthlyCharges, apps);
  const yearlyAppTotals = buildAppChargeTotals(yearlyCharges, apps);

  const monthlyTopApp = monthlyAppTotals[0] ?? null;
  const yearlyTopApp = yearlyAppTotals[0] ?? null;

  return {
    appCount: apps.length,
    monthlyChargeCount,
    monthlyTotalAmount,
    yearlyTotalAmount,
    monthlyTopApp,
    yearlyTopApp,
    monthlyAppTotals,
  };
}


function buildAppChargeTotals(charges: ChargeRecord[], apps: App[]): AppChargeTotal[] {
  //appIdからアプリ本体を探すMap
  const appById = new Map(apps.map((app) => [app.id, app]));
  //appIdごとの合計金額を保存するMap
  const totalByAppId = new Map<string, number>();

  for (const charge of charges) {
    // アプリIDごとに課金額を集計
    const currentTotal = totalByAppId.get(charge.appId) ?? 0;

    //アプリごとに合計金額を出す
    totalByAppId.set(charge.appId, currentTotal + charge.amount);
  }

  const appTotals: AppChargeTotal[] = [];

  //Map<key, value> (const [key, value] of map)
  for (const [appId, totalAmount] of totalByAppId) {
    const app = appById.get(appId);

    if (!app) {
      continue;
    }

    appTotals.push({
      appId: app.id,
      appName: app.name,
      appIcon: app.icon,
      totalAmount,
    });
  }

  return appTotals
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);
}
//画面に並べるなら配列、キーで探しやすい箱を作るならMap
