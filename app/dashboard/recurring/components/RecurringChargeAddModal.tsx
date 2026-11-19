import { useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import { CalendarDays, Plus, X } from "lucide-react";
import { chargeCategories } from "../../../lib/chargeCategories";
import { getNextBillingDate } from "../../../lib/recurringBilling";
import {
  formatChargeDateLabel,
  formatWeekdayLabel,
  parseChargeDate,
} from "../../../lib/format";
import type { App, BillingCycle, ChargeCategory } from "../../../lib/types";

export type AddRecurringChargeInput = {
  appId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  intervalDays: number | null;
  billingDay: number | null;
  shouldAddTodayCharge: boolean;
};

type RecurringChargeAddModalProps = {
  apps: App[];
  appId: string;
  onAppIdChange: (appId: string) => void;
  onAdd: (input: AddRecurringChargeInput) => Promise<void>;
  onClose: () => void;
};

function formatBillingDate(value: string) {
  const date = parseChargeDate(value);

  return `${formatChargeDateLabel(date)}（${formatWeekdayLabel(date)}）`;
}

const ITEM_NAME_MAX_LENGTH = 20;

export default function RecurringChargeAddModal({
  apps,
  appId,
  onAppIdChange,
  onAdd,
  onClose,
}: RecurringChargeAddModalProps) {
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ChargeCategory>("月パス");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("days");
  const [intervalDays, setIntervalDays] = useState("30");
  const [billingDay, setBillingDay] = useState(() =>
    String(new Date().getDate()),
  );
  const [shouldAddTodayCharge, setShouldAddTodayCharge] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    appId: "",
    itemName: "",
    amount: "",
    intervalDays: "",
    billingDay: "",
  });

  const hasApps = apps.length > 0;

  // 入力中の課金周期から、表示用・保存用の次回課金日を計算する
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
  

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const trimmedItemName = itemName.trim();
    const numericAmount = Number(amount);
    const numericIntervalDays = Number(intervalDays);
    const numericBillingDay = Number(billingDay);

    const nextErrors = {
      appId: "",
      itemName: "",
      amount: "",
      intervalDays: "",
      billingDay: "",
    };

    if (!appId) {
      nextErrors.appId = "アプリを選択してください";
    }

    if (!trimmedItemName) {
      nextErrors.itemName = "アイテム名を入力してください";
    }

    if (trimmedItemName.length > ITEM_NAME_MAX_LENGTH) {
      nextErrors.itemName = `アイテム名は${ITEM_NAME_MAX_LENGTH}文字以内で入力してください`;
    }

    if (
      !Number.isFinite(numericAmount) ||
      !Number.isInteger(numericAmount) ||
      numericAmount <= 0
    ) {
      nextErrors.amount = "金額は1円以上の整数で入力してください";
    }

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
      nextErrors.appId ||
      nextErrors.itemName ||
      nextErrors.amount ||
      nextErrors.intervalDays ||
      nextErrors.billingDay ||
      !computedNextBillingDate
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAdd({
        appId,
        itemName: trimmedItemName,
        amount: numericAmount,
        category,
        billingCycle,
        nextBillingDate: computedNextBillingDate,
        intervalDays: billingCycle === "days" ? numericIntervalDays : null,
        billingDay: billingCycle === "monthly" ? numericBillingDay : null,
        shouldAddTodayCharge,
      });
    } catch {
      setErrors((current) => ({
        ...current,
        amount: "定期課金の追加に失敗しました",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeAddModal() {
    if (isSubmitting) return;
    onClose();
  }
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-950/40 px-4 pb-4 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="定期課金追加モーダルを閉じる"
        onClick={closeAddModal}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-w-md sm:rounded-[28px] sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
            <Plus size={20} strokeWidth={2.2} aria-hidden="true" />
            定期課金を追加
          </h2>
          <button
            type="button"
            onClick={closeAddModal}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="閉じる"
          >
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">アプリ</span>
            <select
              value={appId}
              onChange={(event) => {
                onAppIdChange(event.target.value);
                setErrors((current) => ({ ...current, appId: "" }));
              }}
              disabled={!hasApps}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {hasApps ? (
                apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))
              ) : (
                <option value="">アプリがありません</option>
              )}
            </select>
            {errors.appId ? (
              <p className="mt-2 text-xs font-bold text-rose-600">
                {errors.appId}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              アイテム名
            </span>
            <input
              type="text"
              value={itemName}
              onChange={(event) => {
                setItemName(event.target.value);
                setErrors((current) => ({ ...current, itemName: "" }));
              }}
              maxLength={ITEM_NAME_MAX_LENGTH}
              placeholder="例: 月パス"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
            {errors.itemName ? (
              <p className="mt-2 text-xs font-bold text-rose-600">
                {errors.itemName}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">金額</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setErrors((current) => ({ ...current, amount: "" }));
              }}
              placeholder="例: 980"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
            {errors.amount ? (
              <p className="mt-2 text-xs font-bold text-rose-600">
                {errors.amount}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              カテゴリ
            </span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ChargeCategory)
              }
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              {chargeCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm font-semibold text-slate-700">
              課金の繰り返し
            </span>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("days");
                    setErrors((current) => ({
                      ...current,
                      billingDay: "",
                    }));
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
                    setErrors((current) => ({
                      ...current,
                      intervalDays: "",
                    }));
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
                    <span className="text-sm font-bold text-slate-700">
                      毎月
                    </span>
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
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-700">
            <p className="flex items-center gap-2 text-sm font-bold">
              <CalendarDays size={18} strokeWidth={2.2} aria-hidden="true" />
              {computedNextBillingDate
                ? `次回課金日: ${formatBillingDate(
                    computedNextBillingDate,
                  )} に予定されます`
                : "次回課金日を計算できません"}
            </p>
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={shouldAddTodayCharge}
              onChange={(event) =>
                setShouldAddTodayCharge(event.target.checked)
              }
              className="mt-1 h-4 w-4 accent-slate-950"
            />
            <span>
              <span className="block text-sm font-bold text-slate-800">
                今日の課金も履歴に追加する
              </span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                加入日を記録したい場合におすすめです
              </span>
            </span>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={closeAddModal}
            className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "追加中..." : "追加"}
          </button>
        </div>
      </form>
    </div>
  );
}
