import { Plus } from "lucide-react";
import type { App, RecurringCharge } from "../../../lib/types";
import RecurringChargeRow from "./RecurringChargeRow";
type RecurringChargeListProps = {
  recurringCharges: RecurringCharge[];
  apps: App[];
  isLoading: boolean;
  errorMessage: string | null;
  openActionMenuId: string | null;
  onAdd: () => void;
  onToggleActionMenu: (id: string) => void;
  onPause: (id: string) => void;
  onResumeRequest: (charge: RecurringCharge) => void;
  onDelete: (id: string) => void;
};

export default function RecurringChargelist({
  recurringCharges,
  apps,
  isLoading,
  errorMessage,
  openActionMenuId,
  onAdd,
  onToggleActionMenu,
  onPause,
  onResumeRequest,
  onDelete,
}: RecurringChargeListProps) {
  const appById = new Map(apps.map((app) => [app.id, app]));

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-950">登録中の定期課金</h2>
        <button
          type="button"
          onClick={() => onAdd()}
          disabled={isLoading}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-[0_16px_28px_-20px_rgba(15,23,42,0.75)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-12 sm:rounded-xl sm:bg-slate-950 sm:px-5 sm:shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] sm:hover:bg-slate-800"
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

        {isLoading ? (
          <div className="bg-slate-50 px-5 py-10 text-center">
            <p className="text-sm font-bold text-slate-600">
              定期課金を読み込んでいます
            </p>
          </div>
        ) : errorMessage ? (
          <div className="bg-slate-50 px-5 py-10 text-center">
            <p className="text-sm font-bold text-rose-600">{errorMessage}</p>
          </div>
        ) : recurringCharges.length === 0 ? (
          <div className="bg-slate-50 px-5 py-10 text-center">
            <p className="text-sm font-bold text-slate-600">
              定期課金がありません
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {recurringCharges.map((charge) => (
              <RecurringChargeRow
                key={charge.id}
                charge={charge}
                app={appById.get(charge.appId)}
                isMenuOpen={openActionMenuId === charge.id}
                onToggleMenu={() => onToggleActionMenu(charge.id)}
                onPause={() => onPause(charge.id)}
                onResume={() => onResumeRequest(charge)}
                onDelete={() => onDelete(charge.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
