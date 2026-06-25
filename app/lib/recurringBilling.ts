import type { BillingCycle } from "./types";
import { formatDateInputValue, parseChargeDate } from "./format";

//指定した日付に周期を足す
function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function getLastDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

//指定した年月のbillingDay日が存在しない場合は、月末日を返す
function getBillingDateInMonth(
  year: number,
  monthIndex: number,
  billingDay: number,
) {
  const lastDay = getLastDayOfMonth(year, monthIndex);
  const targetDay = Math.min(billingDay, lastDay);

  return new Date(year, monthIndex, targetDay);
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

  return getBillingDateInMonth(targetYear, targetMonthIndex, billingDay);
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

//。処理済みの課金日を基準に、次の課金日を1つ計算する。
export function getFollowingBillingDate(params: {
  billingCycle: BillingCycle;
  intervalDays: number;
  billingDay: number;
  baseDate: Date;
}) {
  if (params.billingCycle === "days") {
    return formatDateInputValue(addDays(params.baseDate, params.intervalDays));
  }

  //// 次の月を対象にする
  const targetMonth = params.baseDate.getMonth() + 1;
  // 翌月が年をまたぐ場合は、ここで翌年に直す
  const targetYear = new Date(
    params.baseDate.getFullYear(),
    targetMonth,
    1,
  ).getFullYear();
  // 翌月が12を超える場合は、ここで0（1月）に直す
  const targetMonthIndex = new Date(
    params.baseDate.getFullYear(),
    targetMonth,
    1,
  ).getMonth();

  return formatDateInputValue(
    getBillingDateInMonth(targetYear, targetMonthIndex, params.billingDay),
  );
}

//次回課金日が今日以前の日付であれば、過去の課金日を全て取得する
export function collectDueBillingDates(params: {
  billingCycle: BillingCycle;
  intervalDays: number;
  billingDay: number;
  nextBillingDate: string;
  today: string;
}) {
  let billingDate = params.nextBillingDate;
  const chargedDates: string[] = [];

  //次回課金日が今日以前であれば、過去の課金日を全て取得する
  while (billingDate <= params.today) {
    chargedDates.push(billingDate);

    billingDate = getFollowingBillingDate({
      billingCycle: params.billingCycle,
      intervalDays: params.intervalDays,
      billingDay: params.billingDay,
      baseDate: parseChargeDate(billingDate),
    });
  }
  // pushされるのは今日以前だけ。billingDateは最後に1つ未来の課金日になる
  return {
    chargedDates,
    nextBillingDate: billingDate,
  };
}
