"use client";

import Link from "next/link";
import { Info, LockKeyhole, Mail } from "lucide-react";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { sendPasswordResetEmail } from "../../lib/auth";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const { error } = await sendPasswordResetEmail(trimmedEmail);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("再設定用リンクの送信に失敗しました");
      return;
    }

    setMessage("再設定用リンクをメールで送信しました");
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
          パスワードをお忘れですか？
        </h2>
        <p className="mt-4 text-center text-sm font-semibold leading-7 text-slate-500">
          登録済みのメールアドレスを入力すると、
          <br />
          パスワード再設定用のリンクをお送りします。
        </p>

        <div className="mt-7 space-y-6">
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

          {message ? (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700">
              {message}
            </p>
          ) : null}

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
            {isSubmitting ? "送信中..." : "再設定用リンクを送信"}
          </button>

          <Link
            href="/login"
            className="mx-auto block text-center text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            ログイン画面に戻る
          </Link>

          <div className="flex gap-3 rounded-lg bg-blue-50 px-4 py-4 text-sm font-semibold leading-7 text-blue-600">
            <Info
              size={20}
              strokeWidth={2}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p>
              メールが届かない場合は、迷惑メールフォルダをご確認ください。
              それでも届かない場合は、再度お試しください。
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
