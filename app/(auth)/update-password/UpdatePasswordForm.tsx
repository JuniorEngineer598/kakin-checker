"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { updatePassword } from "../../lib/auth";

export default function UpdatePasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("パスワードは6文字以上で入力してください");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("パスワードが一致しません");
      return;
    }

    setIsSubmitting(true);

    const { error } = await updatePassword(password);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("パスワードの更新に失敗しました");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-100 bg-white/95 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="px-4 pb-7 pt-6 sm:px-10 sm:pt-12"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <LockKeyhole size={36} strokeWidth={2.2} aria-hidden="true" />
        </div>

        <h2 className="mt-6 text-center text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">
          新しいパスワード
        </h2>
        <p className="mt-4 text-center text-sm font-semibold leading-7 text-slate-500">
          新しいパスワードを入力してください。
          <br />
          更新後はそのままアプリを利用できます。
        </p>

        <div className="mt-7 space-y-6">
          <label className="block">
            <span className="text-sm font-bold text-slate-950">
              新しいパスワード
            </span>
            <span className="mt-3 flex h-14 min-w-0 max-w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-slate-400 shadow-sm sm:px-4">
              <LockKeyhole size={22} strokeWidth={2} aria-hidden="true" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="新しいパスワードを入力"
                autoComplete="new-password"
                required
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
                aria-label={
                  isPasswordVisible
                    ? "パスワードを非表示にする"
                    : "パスワードを表示する"
                }
                className="shrink-0 text-slate-400 transition hover:text-slate-600"
              >
                {isPasswordVisible ? (
                  <EyeOff size={22} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Eye size={22} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-950">
              パスワード確認
            </span>
            <span className="mt-3 flex h-14 min-w-0 max-w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-slate-400 shadow-sm sm:px-4">
              <LockKeyhole size={22} strokeWidth={2} aria-hidden="true" />
              <input
                type={isPasswordConfirmationVisible ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                placeholder="もう一度入力"
                autoComplete="new-password"
                required
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() =>
                  setIsPasswordConfirmationVisible((current) => !current)
                }
                aria-label={
                  isPasswordConfirmationVisible
                    ? "確認用パスワードを非表示にする"
                    : "確認用パスワードを表示する"
                }
                className="shrink-0 text-slate-400 transition hover:text-slate-600"
              >
                {isPasswordConfirmationVisible ? (
                  <EyeOff size={22} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Eye size={22} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-base font-bold text-white shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "更新中..." : "パスワードを更新"}
          </button>
        </div>
      </form>
    </div>
  );
}
