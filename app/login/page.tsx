import { ChartColumn, FileText, History } from 'lucide-react';
import LoginForm from './LoginForm';

const features = [
  {
    title: '課金を可視化',
    description: '月別・ゲーム別に支出を把握',
    icon: ChartColumn,
  },
  {
    title: '履歴を記録',
    description: 'いつ、何に、いくら使ったかを保存',
    icon: History,
  },
  {
    title: 'テンプレート保存',
    description: 'よく使う課金内容をすばやく記録',
    icon: FileText,
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-3 text-slate-950">
      <section className="relative min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.5)]">
        <div className="absolute -left-24 -top-28 h-80 w-[34rem] rounded-b-[55%] bg-blue-100/40 blur-2xl" aria-hidden="true" />
        <div className="absolute left-20 top-28 grid grid-cols-7 gap-4 opacity-45" aria-hidden="true">
          {Array.from({ length: 35 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-blue-300" />
          ))}
        </div>

        <svg
          className="absolute bottom-0 left-0 h-56 w-full text-blue-100/80"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0 120C130 155 190 195 340 185C520 173 570 125 790 145C980 163 1040 215 1235 194C1320 185 1382 162 1440 146V260H0V120Z"
          />
          <path
            fill="currentColor"
            fillOpacity="0.55"
            d="M0 180C170 202 240 250 430 242C610 235 685 190 860 190C1030 190 1120 230 1288 225C1360 223 1410 210 1440 200V260H0V180Z"
          />
        </svg>

        <div className="relative z-10 grid min-h-[calc(100vh-1.5rem)] grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <img
                  src="/kakin_checker_logo_mark.svg"
                  alt=""
                  className="h-28 w-28 shrink-0 sm:h-36 sm:w-36 lg:h-40 lg:w-40"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h1 className="text-4xl font-black tracking-normal text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                    課金チェッカー
                  </h1>
                  <p className="mt-4 text-base font-semibold tracking-normal text-slate-900 sm:text-xl lg:text-2xl">
                    データで見える、スマートに課金管理を。
                  </p>
                </div>
              </div>

              <div className="mt-4 h-1 w-16 rounded-full bg-blue-600" />

              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
                  毎月の課金を見える化して、無理のない管理を。
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
                  アプリごとの課金履歴を記録し、月別に支出の傾向を確認できます。
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.7)]">
                        <Icon size={28} strokeWidth={2.2} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950">{feature.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-[460px]">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
