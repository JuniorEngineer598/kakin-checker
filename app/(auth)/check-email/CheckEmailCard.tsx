import Link from "next/link";
import { Info, MailCheck } from "lucide-react";

export default function CheckEmailCard() {
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-100 bg-white/95 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="px-4 pb-7 pt-6 sm:px-10 sm:pt-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <MailCheck size={38} strokeWidth={2.1} aria-hidden="true" />
        </div>

        <h2 className="mt-6 text-center text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">
          メールを確認してください
        </h2>
        <p className="mt-4 text-center text-sm font-semibold leading-7 text-slate-500">
          登録したメールアドレスに
          <br />
          確認用リンクを送信しました。
        </p>

        <div className="mt-7 space-y-6">
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-base font-bold text-white shadow-[0_16px_28px_-20px_rgba(37,99,235,0.9)] transition hover:bg-blue-700"
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
              それでも届かない場合は、少し時間をおいて再度お試しください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
