import { parseChargeDate } from './format';
import type { ChargeRecord } from './types';

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