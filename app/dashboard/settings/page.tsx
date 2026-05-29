import LogoutButton from "./LogoutButton";
import ResetDataButton from "./ResetDataButton";
import {
  AlertTriangle,
  Code2,
  FileText,
  LogOut,
  Moon,
  Palette,
  RotateCcw,
  Settings,
  Sun,
  Upload,
  UserX,
} from "lucide-react";
import type { ReactNode } from "react";
import PageBackground from "../../components/PageBackground";

export default function SettingsPage() {
  return (
    <PageBackground className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="inline-flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <Settings size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">設定</h1>
        </div>

        <section className="grid gap-4 sm:gap-5">
          <article className="rounded-[24px] bg-white px-5 py-6 shadow-[0_18px_60px_-38px_rgba(15,23,42,0.24)] sm:px-6 lg:px-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:items-center">
              <div className="flex min-w-0 gap-4">
                <SettingsIcon>
                  <Palette size={24} strokeWidth={2.1} aria-hidden="true" />
                </SettingsIcon>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-950">
                    テーマ設定
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    アプリの表示テーマを選択します。
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-400 bg-white px-4 text-sm font-bold text-blue-600 shadow-[0_12px_28px_-24px_rgba(37,99,235,0.9)]"
                  >
                    <Sun size={18} strokeWidth={2.1} aria-hidden="true" />
                    ライト
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-600 transition hover:bg-white"
                  >
                    <Moon size={18} strokeWidth={2.1} aria-hidden="true" />
                    ダーク
                  </button>
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-500">
                  ※準備中
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] bg-white px-5 py-6 shadow-[0_18px_60px_-38px_rgba(15,23,42,0.24)] sm:px-6 lg:px-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:items-center">
              <div className="flex min-w-0 gap-4">
                <SettingsIcon>
                  <Upload size={24} strokeWidth={2.1} aria-hidden="true" />
                </SettingsIcon>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-950">
                    エクスポート
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    登録データをファイルに書き出します。
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <FileText size={18} strokeWidth={2.1} aria-hidden="true" />
                    CSVで書き出す
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Code2 size={18} strokeWidth={2.1} aria-hidden="true" />
                    JSONで書き出す
                  </button>
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-500">
                  ※準備中
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] bg-white px-5 py-6 shadow-[0_18px_60px_-38px_rgba(15,23,42,0.24)] sm:px-6 lg:px-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex min-w-0 gap-4">
                <SettingsIcon>
                  <LogOut size={24} strokeWidth={2.1} aria-hidden="true" />
                </SettingsIcon>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-950">
                    ログアウト
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    現在のアカウントからログアウトします。
                  </p>
                </div>
              </div>

              <LogoutButton />
            </div>
          </article>

          <section className="rounded-[24px] border border-rose-200 bg-white/80 px-5 py-6 shadow-[0_18px_60px_-38px_rgba(225,29,72,0.28)] sm:px-6 lg:px-7">
            <div className="mb-5 flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 shrink-0 text-rose-500"
                size={22}
                strokeWidth={2.2}
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  危険ゾーン
                </h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  以下の操作は取り消せません。十分にご注意ください。
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <article className="rounded-2xl border border-rose-100 bg-white px-5 py-6 sm:px-6 lg:px-7">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex min-w-0 gap-4">
                    <SettingsIcon tone="rose">
                      <RotateCcw
                        size={24}
                        strokeWidth={2.1}
                        aria-hidden="true"
                      />
                    </SettingsIcon>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-950">
                        データリセット
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        すべての登録データを削除し、初期状態に戻します。
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                        <AlertTriangle
                          size={18}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                        この操作は取り消せません。
                      </div>
                    </div>
                  </div>

                  <ResetDataButton />
                </div>
              </article>

              <article className="rounded-2xl border border-rose-100 bg-white px-5 py-6 sm:px-6 lg:px-7">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex min-w-0 gap-4">
                    <SettingsIcon tone="rose">
                      <UserX size={24} strokeWidth={2.1} aria-hidden="true" />
                    </SettingsIcon>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-950">
                        アカウントを消去
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        アカウントと関連データを完全に削除します。
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                        <AlertTriangle
                          size={18}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                        準備中
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 text-sm font-bold text-rose-300 sm:w-auto"
                  >
                    <UserX size={18} strokeWidth={2.2} aria-hidden="true" />
                    アカウントを消去
                  </button>
                </div>
              </article>
            </div>
          </section>
        </section>
      </div>
    </PageBackground>
  );
}

//設定項目のアイコン表示用のコンポーネント
function SettingsIcon({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "rose";
}) {
  const colorClass =
    tone === "rose" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600";

  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}
    >
      {children}
    </span>
  );
}
