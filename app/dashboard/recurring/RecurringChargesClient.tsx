"use client";

import { useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import {
  CalendarClock,
  CalendarDays,
  CircleEllipsis,
  ClipboardList,
  EllipsisVertical,
  Plus,
  X,
} from "lucide-react";
import AppIconView from "../../components/AppIconView";
import { chargeCategories } from "../../lib/chargeCategories";
import { createRecurringCharge } from "../../lib/recurringCharges";
import {
  formatChargeDateLabel,
  formatCurrency,
  formatDateInputValue,
  formatWeekdayLabel,
  parseChargeDate,
} from "../../lib/format";
import type { App, ChargeCategory, RecurringCharge } from "../../lib/types";

const ITEM_NAME_MAX_LENGTH = 20;

type RecurringChargesClientProps = {
  initialApps: App[];
  initialRecurringCharges: RecurringCharge[];
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function formatBillingDate(value: string) {
  const date = parseChargeDate(value);

  return `${formatChargeDateLabel(date)}（${formatWeekdayLabel(date)}）`;
}

function getDefaultNextBillingDate() {
  return formatDateInputValue(addDays(new Date(), 30));
}

export default function RecurringChargesClient({
  initialApps,
  initialRecurringCharges,
}: RecurringChargesClientProps) {
  const [apps] = useState<App[]>(initialApps);
  const [recurringCharges, setRecurringCharges] = useState<RecurringCharge[]>(
    initialRecurringCharges,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [appId, setAppId] = useState(initialApps[0]?.id ?? "");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ChargeCategory>("月パス");
  const [nextBillingDate, setNextBillingDate] = useState(
    getDefaultNextBillingDate,
  );
  const [intervalDays, setIntervalDays] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    appId: "",
    itemName: "",
    amount: "",
    nextBillingDate: "",
    intervalDays: "",
  });

  const appById = useMemo(() => {
    return new Map(apps.map((app) => [app.id, app]));
  }, [apps]);

  const activeRecurringCharges = recurringCharges.filter(
    (charge) => charge.status === "active",
  );

  const totalScheduledAmount = activeRecurringCharges.reduce(
    (total, charge) => total + charge.amount,
    0,
  );

  const hasApps = apps.length > 0;

  function resetForm() {
    setItemName("");
    setAmount("");
    setCategory("月パス");
    setNextBillingDate(getDefaultNextBillingDate());
    setIntervalDays("30");
    setErrors({
      appId: "",
      itemName: "",
      amount: "",
      nextBillingDate: "",
      intervalDays: "",
    });
  }

  function closeAddModal() {
    if (isSubmitting) return;

    setIsAddModalOpen(false);
    resetForm();
  }

  //定期課金を追加する処理
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const trimmedItemName = itemName.trim();
    const numericAmount = Number(amount);
    const numericIntervalDays = Number(intervalDays);

    const nextErrors = {
      appId: "",
      itemName: "",
      amount: "",
      nextBillingDate: "",
      intervalDays: "",
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

    if (!nextBillingDate) {
      nextErrors.nextBillingDate = "次回課金日を入力してください";
    }

    if (
      !Number.isFinite(numericIntervalDays) ||
      !Number.isInteger(numericIntervalDays) ||
      numericIntervalDays <= 0
    ) {
      nextErrors.intervalDays = "課金間隔は1日以上の整数で入力してください";
    }

    setErrors(nextErrors);

    if (
      nextErrors.appId ||
      nextErrors.itemName ||
      nextErrors.amount ||
      nextErrors.nextBillingDate ||
      nextErrors.intervalDays
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdRecurringCharge = await createRecurringCharge({
        appId,
        itemName: trimmedItemName,
        amount: numericAmount,
        category,
        nextBillingDate,
        intervalDays: numericIntervalDays,
      });

      setRecurringCharges((current) =>
        [...current, createdRecurringCharge].sort((a, b) =>
          a.nextBillingDate.localeCompare(b.nextBillingDate),
        ),
      );
      resetForm();
      setIsAddModalOpen(false);
    } catch {
      setErrors((current) => ({
        ...current,
        amount: "定期課金の追加に失敗しました",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="inline-flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
          <CalendarClock size={22} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold text-slate-950">定期課金</h1>
      </div>

      <section className="grid grid-cols-[minmax(0,1.9fr)_minmax(6.75rem,0.85fr)] gap-3 lg:grid-cols-2 lg:gap-4">
        <article className="flex min-w-0 items-center gap-3 rounded-[24px] bg-white px-4 py-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:gap-5 sm:rounded-[28px] sm:px-6 sm:py-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
            <CalendarDays
              size={26}
              strokeWidth={2.2}
              aria-hidden="true"
              className="sm:h-[30px] sm:w-[30px]"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
              登録中の定期課金予定
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 sm:mt-2 sm:text-4xl">
              {formatCurrency(totalScheduledAmount)}
            </p>
          </div>
        </article>

        <article className="flex min-w-0 items-center justify-center gap-2 rounded-[24px] bg-white px-2 py-4 text-left shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:justify-start sm:gap-5 sm:rounded-[28px] sm:px-6 sm:py-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:h-16 sm:w-16">
            <ClipboardList
              size={23}
              strokeWidth={2.2}
              aria-hidden="true"
              className="sm:h-[30px] sm:w-[30px]"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 sm:text-sm">
              登録中
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 sm:mt-2 sm:text-4xl">
              {activeRecurringCharges.length}件
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-950">
            登録中の定期課金
          </h2>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-[0_16px_28px_-20px_rgba(15,23,42,0.75)] transition hover:bg-slate-800 sm:h-12 sm:rounded-xl sm:bg-slate-950 sm:px-5 sm:shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] sm:hover:bg-slate-800"
          >
            <Plus size={19} strokeWidth={2.4} aria-hidden="true" />
            <span className="sm:hidden">追加</span>
            <span className="hidden sm:inline">定期課金を追加</span>
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_6.5rem_14rem_3.5rem_3rem] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-500 lg:grid">
            <span>サービス</span>
            <span>金額</span>
            <div className="grid grid-cols-[10rem_5rem] gap-1">
              <span>次回の課金日</span>
              <span className="-translate-x-3">周期</span>
            </div>
            <span className="text-center">ステータス</span>
            <span className="text-right">操作</span>
          </div>

          {recurringCharges.length === 0 ? (
            <div className="bg-slate-50 px-5 py-10 text-center">
              <p className="text-sm font-bold text-slate-600">
                定期課金がありません
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recurringCharges.map((charge) => {
                const app = appById.get(charge.appId);
                return (
                  <article
                    key={charge.id}
                    className="relative bg-white px-5 py-4 pr-14 lg:pr-5"
                  >
                    <div className="grid gap-2 lg:grid-cols-[minmax(0,1.5fr)_6.5rem_14.8rem_3rem_3.5rem] lg:items-center lg:gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {app ? (
                          <AppIconView
                            icon={app.icon}
                            className="h-12 w-12 shrink-0 rounded-full"
                            iconClassName="h-6 w-6"
                          />
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />
                        )}

                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <p className="truncate text-base font-black text-slate-950">
                              {app?.name ?? "不明なアプリ"}
                            </p>
                            <span className="shrink-0 text-sm font-bold text-slate-300">
                              /
                            </span>
                            <div className="flex min-w-0 items-center gap-2">
                              <p className="truncate text-base font-black text-slate-950">
                                {charge.itemName}
                              </p>
                              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                                {charge.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-400 lg:hidden">
                          金額
                        </p>
                        <p className="text-lg font-bold text-slate-950">
                          {formatCurrency(charge.amount)}
                        </p>
                      </div>

                      <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(4.25rem,0.8fr)_minmax(4.5rem,0.8fr)] items-start gap-4 lg:grid-cols-[10rem_5rem] lg:items-center lg:gap-1">
                        <div className="flex flex-col items-center text-center lg:block lg:text-left">
                          <p className="text-xs font-bold text-slate-400 lg:hidden">
                            次回の課金日
                          </p>
                          <p className="text-sm font-bold text-slate-700 lg:whitespace-nowrap">
                            {formatBillingDate(charge.nextBillingDate)}
                          </p>
                        </div>

                        <div className="flex flex-col items-center text-center lg:block lg:text-left">
                          <p className="text-xs font-bold text-slate-400 lg:hidden">
                            周期
                          </p>
                          <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 lg:-translate-x-3">
                            {charge.intervalDays}日
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center lg:hidden">
                          <p className="text-xs font-bold text-slate-400">
                            ステータス
                          </p>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              charge.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {charge.status === "active" ? "有効" : "一時停止"}
                          </span>
                        </div>
                      </div>

                      <div className="hidden lg:block lg:text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            charge.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {charge.status === "active" ? "有効" : "一時停止"}
                        </span>
                      </div>

                      <div className="absolute right-4 top-4 flex justify-end lg:relative lg:right-auto lg:top-auto">
                        <button
                          type="button"
                          aria-label={`${charge.itemName}の操作メニュー`}
                          aria-expanded={openActionMenuId === charge.id}
                          onClick={() =>
                            setOpenActionMenuId((current) =>
                              current === charge.id ? null : charge.id,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <CircleEllipsis
                            size={23}
                            strokeWidth={2.1}
                            aria-hidden="true"
                            className="lg:hidden"
                          />
                          <EllipsisVertical
                            size={20}
                            strokeWidth={2.2}
                            aria-hidden="true"
                            className="hidden lg:block"
                          />
                        </button>
                        {openActionMenuId === charge.id ? (
                          <div className="absolute right-0 top-10 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                            <button
                              type="button"
                              className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              編集
                            </button>
                            <button
                              type="button"
                              className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              {charge.status === "active" ? "一時停止" : "再開"}
                            </button>
                            <button
                              type="button"
                              className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                            >
                              削除
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {isAddModalOpen ? (
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
                <span className="text-sm font-semibold text-slate-700">
                  アプリ
                </span>
                <select
                  value={appId}
                  onChange={(event) => {
                    setAppId(event.target.value);
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
                <span className="text-sm font-semibold text-slate-700">
                  金額
                </span>
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

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  次回課金日
                </span>
                <input
                  type="date"
                  value={nextBillingDate}
                  onChange={(event) => {
                    setNextBillingDate(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      nextBillingDate: "",
                    }));
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                {errors.nextBillingDate ? (
                  <p className="mt-2 text-xs font-bold text-rose-600">
                    {errors.nextBillingDate}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  課金間隔（日数）
                </span>
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
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                {errors.intervalDays ? (
                  <p className="mt-2 text-xs font-bold text-rose-600">
                    {errors.intervalDays}
                  </p>
                ) : null}
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
      ) : null}
    </div>
  );
}
