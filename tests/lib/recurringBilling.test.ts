import { expect, test } from "vitest";
import { collectDueBillingDates } from "../../app/lib/recurringBilling";

test("10日ごとの課金日を今日まで集め、未来の次回課金日を返す", () => {
  // 入力を渡して、実際の計算処理を動かす
  const result = collectDueBillingDates({
    billingCycle: "days",
    intervalDays: 10,
    billingDay: 1,
    nextBillingDate: "2026-10-01",
    today: "2026-10-25",
  });

  // 計算結果が、期待する日付と一致するか確認する
  expect(result).toEqual({
    chargedDates: [
      "2026-10-01",
      "2026-10-11",
      "2026-10-21",
    ],
    nextBillingDate: "2026-10-31",
  });
});

test("未処理の課金日がない場合は空配列を返す", () => {
  const result = collectDueBillingDates({
    billingCycle: "days",
    intervalDays: 10,
    billingDay: 0,
    nextBillingDate: "2026-11-20",
    today: "2026-11-09",
  });

  expect(result).toEqual({
    chargedDates: [],
    nextBillingDate: "2026-11-20",
  });
});

test ("月次の課金日を計算できる", () => {
  const result = collectDueBillingDates({
    billingCycle: "monthly",
    intervalDays: 0,
    billingDay: 15,
    nextBillingDate: "2026-10-15",
    today: "2026-11-20",
  });


  expect(result).toEqual({
    chargedDates: [
      "2026-10-15",
      "2026-11-15",
    ],
    nextBillingDate: "2026-12-15",
  });
});

test ("月次の31日指定の月末を補正できる", () => {
  const result = collectDueBillingDates({
    billingCycle: "monthly",
    intervalDays: 0,
    billingDay: 31,
    nextBillingDate: "2026-01-31",
    today: "2026-06-01",
  });


  expect(result).toEqual({
    chargedDates: [
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
      "2026-04-30",
      "2026-05-31",
    ],
    nextBillingDate: "2026-06-30",
  });
});