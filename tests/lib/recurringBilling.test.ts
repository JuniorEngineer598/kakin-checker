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