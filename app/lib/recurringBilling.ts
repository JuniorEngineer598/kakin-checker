import type { BillingCycle } from "./types";
import { formatDateInputValue } from "./format";

//指定した日付に周期を足す
function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function getLastDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
//毎月同じ日の次回課金日を取得する
function getMonthlyBillingDate(baseDate: Date, billingDay: number) {
  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();
  const today = baseDate.getDate();

  const targetMonth = billingDay > today ? baseMonth : baseMonth + 1;

  //targetMonthが年をまたぐ場合も含めて、正しい年を取得する。
  const targetYear = new Date(baseYear, targetMonth, 1).getFullYear();
  //年またぎも考慮して、正しい月を取得する。
  const targetMonthIndex = new Date(baseYear, targetMonth, 1).getMonth();
  const lastDay = getLastDayOfMonth(targetYear, targetMonthIndex);
  const targetDay = Math.min(billingDay, lastDay);

  return new Date(targetYear, targetMonthIndex, targetDay);
}

export function getNextBillingDate(params: {
  billingCycle: BillingCycle;
  intervalDays: number;
  billingDay: number;
  baseDate?: Date;
}) {
  const baseDate = params.baseDate ?? new Date();

  if (params.billingCycle === "days") {
    return formatDateInputValue(addDays(baseDate, params.intervalDays));
  }

  return formatDateInputValue(
    getMonthlyBillingDate(baseDate, params.billingDay),
  );
}