import { parseChargeDate } from './format';
import type { ChargeRecord, App } from './types';

export type MonthlyAnalysisItem = {
  month: number;
  totalAmount: number;
  chargeCount: number;
};

export type AnalysisStats = {
  monthlyItems: MonthlyAnalysisItem[];
  yearlyTotalAmount: number;
  yearlyChargeCount: number;
};

export type AppChargeShareItem = {
  appId: string;
  appName: string;
  appTotalAmount: number;
  percentage: number;
};

export type BuildAppChargeShareOptions = {
  year: number;
  month?: number;
};

export function buildAnalysisStats(charges: ChargeRecord[], year: number): AnalysisStats {
  const monthlyItems: MonthlyAnalysisItem[] = Array.from({ length: 12 }, (_, index) => {
    return {
      month: index + 1,
      totalAmount: 0,
      chargeCount: 0,
    };
  });

  for (const charge of charges) {
    const chargeDate = parseChargeDate(charge.chargedAt);

    //指定した年以外の課金はスキップ
    if (chargeDate.getFullYear() !== year) {
      continue;
    }

    //getMonth()は0から11の値を返す getMonth()はchargeDateを読める
    const monthIndex = chargeDate.getMonth();
    const monthlyItem = monthlyItems[monthIndex];

    monthlyItem.totalAmount += charge.amount;
    monthlyItem.chargeCount += 1;
  }

  const yearlyTotalAmount = monthlyItems.reduce((total, item) => {
    return total + item.totalAmount;
  }, 0);

  const yearlyChargeCount = monthlyItems.reduce((total, item) => {
    return total + item.chargeCount;
  }, 0);

  return {
    monthlyItems,
    yearlyTotalAmount,
    yearlyChargeCount,
  };
}

export function buildAppChargeShares(
  charges: ChargeRecord[],
  apps: App[],
  options: BuildAppChargeShareOptions,
): AppChargeShareItem[] {
  
  const appNameById = new Map(
    apps.map((app) => {
      return [app.id, app.name];
    }),
  );
  //アプリIDとそのアプリの課金額の合計のマップを作成
  const amountByAppId = new Map<string, number>();

  for (const charge of charges) {
    const chargeDate = parseChargeDate(charge.chargedAt);

    if (chargeDate.getFullYear() !== options.year) {
      continue;
    }

    if (options.month && chargeDate.getMonth() + 1 !== options.month) {
      continue;
    }

    const currentAmount = amountByAppId.get(charge.appId) ?? 0;

    //アプリごとの課金額の合計を更新
    amountByAppId.set(charge.appId, currentAmount + charge.amount);
  }

  //全アプリの課金額の合計を計算
  const totalAmount = Array.from(amountByAppId.values()).reduce((total, appTotalAmount) => {
    return total + appTotalAmount;
  }, 0);

  if (totalAmount === 0) {
    return [];
  }

  //mapを配列に変換し、アプリごとの課金額の合計と全体に対する割合を計算して返す
  return Array.from(amountByAppId.entries())
    .map(([appId, appTotalAmount]) => {
      return {
        appId,
        appName: appNameById.get(appId) ?? '削除済みアプリ',
        appTotalAmount,
        percentage: Math.round((appTotalAmount / totalAmount) * 100),//totalAmountでパーセンテージを計算
      };
    })
    .sort((first, second) => second.appTotalAmount - first.appTotalAmount);
}

/*[
  ["App-1", 3000]
]*/