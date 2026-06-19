"use client";

import { useMemo, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import {
  formatChargeDateLabel,
  formatWeekdayLabel,
  parseChargeDate,
} from "../../lib/format";
import type { BillingCycle, RecurringCharge } from "../../lib/types";
import { getNextBillingDate } from "../../lib/recurringBilling";

type RecurringChargeResumeModalProps = {
  charge: RecurringCharge;
  onClose: () => void;
  onResume: (input: ResumeRecurringChargeInput) => Promise<void>;
};

export type ResumeRecurringChargeInput = {
  billingCycle: BillingCycle;
  intervalDays: number | null;
  billingDay: number | null;
  nextBillingDate: string;
};

function formatBillingDate(value: string) {
  const date = parseChargeDate(value);

  return `${formatChargeDateLabel(date)}（${formatWeekdayLabel(date)}）`;
}

export default function RecurringChargeResumeModal({
  charge,
  onClose,
  onResume,
}: RecurringChargeResumeModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    charge.billingCycle,
  );
  const [intervalDays, setIntervalDays] = useState(
    String(charge.intervalDays ?? 30),
  );
  const [billingDay, setBillingDay] = useState(
    String(charge.billingDay ?? new Date().getDate()),
  );
  const [errors, setErrors] = useState({
    intervalDays: "",
    billingDay: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  //入力内容から次回課金日を計算する
  const computedNextBillingDate = useMemo(() => {
    const numericIntervalDays = Number(intervalDays);
    const numericBillingDay = Number(billingDay);

    if (billingCycle === "days") {
      if (
        !Number.isFinite(numericIntervalDays) ||
        !Number.isInteger(numericIntervalDays) ||
        numericIntervalDays <= 0
      ) {
        return "";
      }

      return getNextBillingDate({
        billingCycle,
        intervalDays: numericIntervalDays,
        billingDay: numericBillingDay,
      });
    }

    if (
      !Number.isFinite(numericBillingDay) ||
      !Number.isInteger(numericBillingDay) ||
      numericBillingDay < 1 ||
      numericBillingDay > 31
    ) {
      return "";
    }

    return getNextBillingDate({
      billingCycle,
      intervalDays: numericIntervalDays,
      billingDay: numericBillingDay,
    });
  }, [billingCycle, billingDay, intervalDays]);

  //再開ボタンを押したときの処理
  async function handleSubmit() {
    if (isSubmitting) return;

    const numericIntervalDays = Number(intervalDays);
    const numericBillingDay = Number(billingDay);

    const nextErrors = {
      intervalDays: "",
      billingDay: "",
    };

    if (
      billingCycle === "days" &&
      (!Number.isFinite(numericIntervalDays) ||
        !Number.isInteger(numericIntervalDays) ||
        numericIntervalDays <= 0)
    ) {
      nextErrors.intervalDays = "課金間隔は1日以上の整数で入力してください";
    }

    if (
      billingCycle === "monthly" &&
      (!Number.isFinite(numericBillingDay) ||
        !Number.isInteger(numericBillingDay) ||
        numericBillingDay < 1 ||
        numericBillingDay > 31)
    ) {
      nextErrors.billingDay = "課金日は1〜31日の整数で入力してください";
    }

    setErrors(nextErrors);

    if (
      nextErrors.intervalDays ||
      nextErrors.billingDay ||
      !computedNextBillingDate
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onResume({
        billingCycle,
        intervalDays: billingCycle === "days" ? numericIntervalDays : null,
        billingDay: billingCycle === "monthly" ? numericBillingDay : null,
        nextBillingDate: computedNextBillingDate,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-950/40 px-4 pb-4 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="定期課金再開モーダルを閉じる"
        onClick={onClose}
      />

      <div className="relative z-10 w-full rounded-t-[28px] bg-white p-5 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-w-md sm:rounded-[28px] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">定期課金を再開</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {charge.itemName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="閉じる"
          >
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6">
          <span className="text-sm font-semibold text-slate-700">
            課金の繰り返し
          </span>

          <div className="mt-2 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setBillingCycle("days");
                setErrors((current) => ({ ...current, billingDay: "" }));
              }}
              className={`h-10 rounded-lg text-sm font-bold transition ${
                billingCycle === "days"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              日数ごと
            </button>

            <button
              type="button"
              onClick={() => {
                setBillingCycle("monthly");
                setErrors((current) => ({ ...current, intervalDays: "" }));
              }}
              className={`h-10 rounded-lg text-sm font-bold transition ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              毎月同じ日
            </button>
          </div>

          {billingCycle === "days" ? (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={intervalDays}
                  onChange={(event) => {
                    setIntervalDays(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      intervalDays: "",
                    }));
                  }}
                  className="h-11 w-24 rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-sm font-bold text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                <span className="text-sm font-bold text-slate-700">
                  日ごとに課金
                </span>
              </div>
              {errors.intervalDays ? (
                <p className="mt-2 text-xs font-bold text-rose-600">
                  {errors.intervalDays}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">毎月</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  step="1"
                  value={billingDay}
                  onChange={(event) => {
                    setBillingDay(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      billingDay: "",
                    }));
                  }}
                  className="h-11 w-24 rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-sm font-bold text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                <span className="text-sm font-bold text-slate-700">
                  日に課金
                </span>
              </div>
              <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
                存在しない日付の月は月末で調整されます。
              </p>
              {errors.billingDay ? (
                <p className="mt-2 text-xs font-bold text-rose-600">
                  {errors.billingDay}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-700">
          <p className="flex items-center gap-2 text-sm font-bold">
            <CalendarDays size={18} strokeWidth={2.2} aria-hidden="true" />
            {computedNextBillingDate
              ? `次回課金日: ${formatBillingDate(
                  computedNextBillingDate,
                )} に予定されます`
              : "次回課金日を計算できません"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "再開中..." : "再開"}
          </button>
        </div>
      </div>
    </div>
  );
}
