"use client";

import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { chargeCategories } from "../../../lib/chargeCategories";
import type { ChargeCategory, App } from "../../../lib/types";
import { formatDateInputValue } from "../../../lib/format";
import { createCharge } from "../../../lib/charges";
import { fetchApps } from "../../../lib/apps";
import { createChargeTemplate } from "../../../lib/chargeTemplates";
import ToastMessage from "../../../components/ToastMessage";

const ITEM_NAME_MAX_LENGTH = 20;

export default function NewChargeForm() {
  const [apps, setApps] = useState<App[]>([]);
  const [appId, setAppId] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [chargedAt, setChargedAt] = useState(formatDateInputValue(new Date()));
  const [category, setCategory] = useState<ChargeCategory>("ガチャ石");
  const [shouldSaveAsTemplate, setShouldSaveAsTemplate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    appId: "",
    itemName: "",
    amount: "",
    chargedAt: "",
  });
  const [toast, setToast] = useState({
    message: "",
    id: 0,
  }); //stateを更新するためにidも持たせる

  const hasApps = apps.length > 0;

  // アプリデータの読み込み
  useEffect(() => {
    async function loadApps() {
      try {
        const loadedApps = await fetchApps();

        setApps(loadedApps);
        setAppId((current) => current || loadedApps[0]?.id || "");
      } catch {
        setErrors((current) => ({
          ...current,
          appId: "アプリ一覧の取得に失敗しました",
        }));
      }
    }

    loadApps();
  }, []);

  useEffect(() => {
    if (!toast.message) return;

    const timerId = window.setTimeout(() => {
      setToast((current) => ({
        ...current,
        message: "",
      }));
    }, 2500);

    return () => window.clearTimeout(timerId);
  }, [toast]);

  // フォーム送信
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedItemName = itemName.trim();
    const numericAmount = Number(amount);
    // バリデーション
    const nextErrors = {
      appId: "",
      itemName: "",
      amount: "",
      chargedAt: "",
    };

    if (!appId) {
      nextErrors.appId = "アプリを追加してください。";
    }

    if (!trimmedItemName) {
      nextErrors.itemName = "アイテム名を入力してください";
    }

    if (trimmedItemName.length > ITEM_NAME_MAX_LENGTH) {
      nextErrors.itemName = `アイテム名は${ITEM_NAME_MAX_LENGTH}文字以内で入力してください`;
    }

    if (!chargedAt) {
      nextErrors.chargedAt = "日付を入力してください";
    }

    if (
      !Number.isFinite(numericAmount) ||
      !Number.isInteger(numericAmount) ||
      numericAmount <= 0
    ) {
      nextErrors.amount = "金額は1円以上の整数で入力してください";
    }

    setErrors(nextErrors);

    if (
      nextErrors.appId ||
      nextErrors.itemName ||
      nextErrors.amount ||
      nextErrors.chargedAt
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createCharge({
        appId: appId,
        itemName: trimmedItemName,
        amount: numericAmount,
        category,
        chargedAt,
      });

      // テンプレートとして保存する場合の処理
      if (shouldSaveAsTemplate) {
        try {
          await createChargeTemplate({
            appId: appId,
            itemName: trimmedItemName,
            amount: numericAmount,
            category,
          });
        } catch {
          window.alert("テンプレートの保存に失敗しました");
        }
      }

      setItemName("");
      setAmount("");
      setCategory("ガチャ石");
      setShouldSaveAsTemplate(false);
      setErrors({
        appId: "",
        itemName: "",
        amount: "",
        chargedAt: "",
      });
      setToast((current) => ({
        message: "課金記録を追加しました",
        id: current.id + 1,
      }));
    } catch {
      setErrors((current) => ({
        ...current,
        amount: "課金記録の追加に失敗しました",
      }));
      return;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] bg-white p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-5"
      >
        <h2 className="text-base font-bold text-slate-950">新規で追加</h2>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">アプリ</span>
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
              placeholder="例: ChatGPT Plus"
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
            <span className="text-sm font-semibold text-slate-700">課金日</span>
            <input
              type="date"
              value={chargedAt}
              onChange={(event) => {
                setChargedAt(event.target.value);
                setErrors((current) => ({ ...current, chargedAt: "" }));
              }}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
            />
            {errors.chargedAt ? (
              <p className="mt-2 text-xs font-bold text-rose-600">
                {errors.chargedAt}
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
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={shouldSaveAsTemplate}
              onChange={(event) =>
                setShouldSaveAsTemplate(event.target.checked)
              }
              className="h-4 w-4 accent-slate-900"
            />
            この内容をテンプレートとして保存する
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
          >
            {isSubmitting ? "登録中..." : "登録"}
          </button>
        </div>
      </form>
      <ToastMessage key={toast.id} message={toast.message} />
    </>
  );
}
