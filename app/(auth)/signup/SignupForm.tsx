"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { signUpWithEmail } from "../../lib/auth";

export default function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
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

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage("メールアドレスを入力してください");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("パスワードは6文字以上で入力してください");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("パスワードが一致しません");
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUpWithEmail(trimmedEmail, password);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("新規登録に失敗しました");
      return;
    }

    router.push("/check-email");
  }

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-100 bg-white/95 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="px-4 pb-7 pt-6 sm:px-10 sm:pt-12"
      >
        <h2 className="text-center text-3xl font-black tracking-normal text-slate-950">
          新規登録
        </h2>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-slate-950">
              メールアドレス
            </span>
            <span className="mt-3 flex h-14 min-w-0 max-w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-slate-400 shadow-sm sm:px-4">
              <Mail size={22} strokeWidth={2} aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="メールアドレスを入力"
                autoComplete="email"
                required
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-950">パスワード</span>
            <span className="mt-3 flex h-14 min-w-0 max-w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-slate-400 shadow-sm sm:px-4">
              <LockKeyhole size={22} strokeWidth={2} aria-hidden="true" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="パスワードを入力"
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
                placeholder="もう一度パスワードを入力"
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
            {isSubmitting ? "登録中..." : "新規登録"}
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center justify-center gap-2 border-t border-slate-200 bg-slate-50/80 px-4 py-5 text-center text-sm font-bold sm:flex-row sm:gap-6 sm:px-8 sm:py-6 sm:text-base">
        <span className="text-slate-500">すでにアカウントをお持ちの方</span>
        <Link href="/login" className="text-blue-600 hover:text-blue-700">
          ログイン
        </Link>
      </div>
    </div>
  );
}
