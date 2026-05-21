import Link from 'next/link';
import { Eye, LockKeyhole, Mail } from 'lucide-react';

export default function LoginForm() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-100 bg-white/95 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="px-8 pb-7 pt-6 sm:px-10 sm:pt-12">
        <h2 className="text-center text-3xl font-black tracking-normal text-slate-950">ログイン</h2>

        <div className="mt-4 space-y-6">
          <label className="block">
            <span className="text-sm font-bold text-slate-950">メールアドレス</span>
            <span className="mt-3 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-slate-400 shadow-sm">
              <Mail size={22} strokeWidth={2} aria-hidden="true" />
              <input
                type="email"
                placeholder="メールアドレスを入力"
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-950">パスワード</span>
            <span className="mt-3 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-slate-400 shadow-sm">
              <LockKeyhole size={22} strokeWidth={2} aria-hidden="true" />
              <input
                type="password"
                placeholder="パスワードを入力"
                className="min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
              />
              <Eye size={22} strokeWidth={2} aria-hidden="true" />
            </span>
          </label>

          <Link
            href="/dashboard"
            className="flex h-14 w-full items-center justify-center rounded-lg bg-blue-600 px-5 text-base font-bold text-white shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] transition hover:bg-blue-700"
          >
            ログイン
          </Link>

          <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            <span>または</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#F2F2F2] px-5 text-base font-bold text-slate-800 transition hover:bg-[#E8E8E8]"
          >
            <img
              src="/web_neutral_rd_na.svg"
              alt=""
              className="h-9 w-9"
              aria-hidden="true"
            />
            Googleでログイン
          </button>

          <button type="button" className="mx-auto block text-sm font-bold text-blue-600 hover:text-blue-700">
            パスワードを忘れた方
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 border-t border-slate-200 bg-slate-50/80 px-6 py-5 text-center text-sm font-bold sm:flex-row sm:gap-6 sm:px-8 sm:py-6 sm:text-base">
        <span className="text-slate-500">アカウントをお持ちでない方</span>
        <button type="button" className="text-blue-600 hover:text-blue-700">
          新規登録
        </button>
      </div>
    </div>
  );
}
