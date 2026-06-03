"use client";

import { AlertTriangle, UserX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function DeleteAccountButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function openDeleteModal() {
    setErrorMessage("");
    setIsConfirmed(false);
    setIsModalOpen(true);
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setIsModalOpen(false);
    setIsConfirmed(false);
    setErrorMessage("");
  }

  async function handleDeleteAccount() {
    if (!isConfirmed || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("failed");
      }

      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      setErrorMessage("アカウントの削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDeleteModal}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-rose-300 bg-white px-6 text-sm font-bold text-rose-600 transition hover:bg-rose-50 sm:w-auto"
      >
        <UserX size={18} strokeWidth={2.2} aria-hidden="true" />
        アカウントを消去
      </button>

      {isModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 pb-4 pt-20 backdrop-blur-[2px] sm:items-center sm:py-6">
          <div className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:rounded-[28px] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <AlertTriangle
                      size={22}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>
                  <h2 className="text-xl font-bold text-slate-950">
                    アカウントを消去しますか？
                  </h2>
                </div>

                <p className="mt-5 text-sm font-semibold leading-6 text-slate-600">
                  アカウント、すべてのアプリ、課金記録、課金テンプレート、アップロード済みのアイコン画像を削除します。
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="text-slate-500 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="閉じる"
              >
                <X size={24} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(event) => setIsConfirmed(event.target.checked)}
                disabled={isDeleting}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-bold leading-6 text-slate-700">
                アカウントと関連データが完全に削除され、この操作を取り消せないことを理解しました。
              </span>
            </label>

            {errorMessage ? (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="h-12 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={!isConfirmed || isDeleting}
                className="h-12 rounded-xl bg-rose-600 px-8 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(225,29,72,0.95)] transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {isDeleting ? "消去中..." : "アカウントを消去"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
