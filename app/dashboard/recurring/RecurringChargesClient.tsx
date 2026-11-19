"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { fetchApps } from "../../lib/apps";
import { createCharge } from "../../lib/charges";
import RecurringChargeResumeModal, {
  type ResumeRecurringChargeInput,
} from "./components/RecurringChargeResumeModal";
import { collectDueBillingDates } from "../../lib/recurringBilling";
import {
  createRecurringCharge,
  fetchRecurringCharges,
  recordRecurringCharges,
  deleteRecurringCharge,
  updateRecurringChargeStatus,
  updateRecurringChargeSchedule,
} from "../../lib/recurringCharges";
import { formatDateInputValue } from "../../lib/format";
import type { App, RecurringCharge } from "../../lib/types";
import ToastMessage from "../../components/ToastMessage";
import RecurringSummary from "./components/RecurringSummary";
import RecurringChargeList from "./components/RecurringChargeList";
import RecurringChargeAddModal, {
  type AddRecurringChargeInput,
} from "./components/RecurringChargeAddModal";

export default function RecurringChargesClient() {
  const [apps, setApps] = useState<App[]>([]);
  const [recurringCharges, setRecurringCharges] = useState<RecurringCharge[]>(
    [],
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [resumeCharge, setResumeCharge] = useState<RecurringCharge | null>(
    null,
  );
  const [appId, setAppId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");

  const [toast, setToast] = useState({
    message: "",
    id: 0,
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedApps, loadedRecurringCharges] = await Promise.all([
          fetchApps(),
          fetchRecurringCharges(),
        ]);

        const today = formatDateInputValue(new Date());
        let totalInsertedCount = 0;

        for (const charge of loadedRecurringCharges) {
          if (charge.status !== "active") continue;

          const result = collectDueBillingDates({
            billingCycle: charge.billingCycle,
            intervalDays: charge.intervalDays ?? 0,
            billingDay: charge.billingDay ?? 0,
            nextBillingDate: charge.nextBillingDate,
            today,
          });

          if (result.chargedDates.length === 0) continue;

          const insertedCount = await recordRecurringCharges({
            recurringChargeId: charge.id,
            expectedNextBillingDate: charge.nextBillingDate,
            expectedUpdatedAt: charge.updatedAt,
            chargedDates: result.chargedDates,
            nextBillingDate: result.nextBillingDate,
          });

          totalInsertedCount += insertedCount;
        }

        if (totalInsertedCount > 0) {
          setToast((current) => ({
            message: `定期課金の履歴を${totalInsertedCount}件追加しました`,
            id: current.id + 1,
          }));
        }

        const latestRecurringCharges = await fetchRecurringCharges();

        setApps(loadedApps);
        setRecurringCharges(latestRecurringCharges);
        setAppId((current) => current || loadedApps[0]?.id || "");
        setLoadErrorMessage("");
      } catch {
        setApps([]);
        setRecurringCharges([]);
        setLoadErrorMessage("定期課金の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!toast.message) return;

    const timerId = window.setTimeout(() => {
      setToast((current) => ({
        ...current,
        message: "",
      }));
    }, 5000);

    return () => window.clearTimeout(timerId);
  }, [toast]);

  const activeRecurringCharges = recurringCharges.filter(
    (charge) => charge.status === "active",
  );

  const totalScheduledAmount = activeRecurringCharges.reduce(
    (total, charge) => total + charge.amount,
    0,
  );

  //定期課金を追加する処理
  async function handleAddRecurringCharge(input: AddRecurringChargeInput) {
    const { shouldAddTodayCharge, ...chargeInput } = input;
    const createdRecurringCharge = await createRecurringCharge(chargeInput);

    if (shouldAddTodayCharge) {
      try {
        await createCharge({
          appId: chargeInput.appId,
          itemName: chargeInput.itemName,
          amount: chargeInput.amount,
          category: chargeInput.category,
          chargedAt: formatDateInputValue(new Date()),
        });
      } catch {
        window.alert("今日の課金履歴の追加に失敗しました");
      }
    }

    setRecurringCharges((current) =>
      [...current, createdRecurringCharge].sort((a, b) =>
        a.nextBillingDate.localeCompare(b.nextBillingDate),
      ),
    );
    setIsAddModalOpen(false);
  }

  //定期課金を削除する処理
  async function handleDeleteRecurringCharge(chargeId: string) {
    const ok = window.confirm("この定期課金を削除しますか？");
    if (!ok) return;

    try {
      await deleteRecurringCharge(chargeId);

      setRecurringCharges((current) =>
        current.filter((charge) => charge.id !== chargeId),
      );
      setOpenActionMenuId(null);
    } catch {
      window.alert("定期課金の削除に失敗しました");
    }
  }

  //定期課金を一時停止する処理
  async function handlePauseRecurringCharge(chargeId: string) {
    try {
      const updatedRecurringCharge = await updateRecurringChargeStatus(
        chargeId,
        "paused",
      );

      setRecurringCharges((current) =>
        current.map((charge) =>
          charge.id === chargeId ? updatedRecurringCharge : charge,
        ),
      );
      setOpenActionMenuId(null);
    } catch {
      window.alert("定期課金の一時停止に失敗しました");
    }
  }

  //定期課金を再開する処理
  async function handleResumeRecurringCharge(
    input: ResumeRecurringChargeInput,
  ) {
    if (!resumeCharge) return;

    try {
      const updatedRecurringCharge = await updateRecurringChargeSchedule(
        resumeCharge.id,
        {
          billingCycle: input.billingCycle,
          intervalDays: input.intervalDays,
          billingDay: input.billingDay,
          nextBillingDate: input.nextBillingDate,
          status: "active",
        },
      );

      setRecurringCharges((current) =>
        current.map((charge) =>
          charge.id === updatedRecurringCharge.id
            ? updatedRecurringCharge
            : charge,
        ),
      );

      setResumeCharge(null);
    } catch {
      window.alert("定期課金の再開に失敗しました");
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

      <RecurringSummary
        totalScheduledAmount={totalScheduledAmount}
        activeCount={activeRecurringCharges.length}
      />

      <RecurringChargeList
        recurringCharges={recurringCharges}
        apps={apps}
        isLoading={isLoading}
        errorMessage={loadErrorMessage}
        openActionMenuId={openActionMenuId}
        onAdd={() => setIsAddModalOpen(true)}
        onToggleActionMenu={(id) =>
          setOpenActionMenuId((current) => (current === id ? null : id))
        }
        onPause={handlePauseRecurringCharge}
        onResumeRequest={(charge) => {
          setResumeCharge(charge);
          setOpenActionMenuId(null);
        }}
        onDelete={handleDeleteRecurringCharge}
      />

      {isAddModalOpen ? (
        <RecurringChargeAddModal
          apps={apps}
          onAppIdChange={setAppId}
          appId={appId}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddRecurringCharge}
        />
      ) : null}

      {resumeCharge ? (
        <RecurringChargeResumeModal
          charge={resumeCharge}
          onClose={() => setResumeCharge(null)}
          onResume={handleResumeRecurringCharge}
        />
      ) : null}

      <ToastMessage key={toast.id} message={toast.message} />
    </div>
  );
}
