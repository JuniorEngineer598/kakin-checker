"use client";

import Image from "next/image";
import { BarChart3, FileText, History } from "lucide-react";
import LoginForm from "./LoginForm";

const features = [
  {
    title: "課金を可視化",
    description: "月別・ゲーム別に支出を把握",
    icon: BarChart3,
  },
  {
    title: "履歴を記録",
    description: "いつ、何に、いくら使ったかを保存",
    icon: History,
  },
  {
    title: "テンプレート保存",
    description: "よく使う課金内容をすばやく記録",
    icon: FileText,
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-2">
      <section className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 px-5 py-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:px-8 lg:px-14 lg:py-12">
        <div className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full bg-blue-100/45 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-blue-100/55 [clip-path:ellipse(74%_70%_at_50%_100%)]" />
        <div className="pointer-events-none absolute left-16 top-24 hidden grid-cols-6 gap-3 opacity-70 sm:grid">
          {Array.from({ length: 36 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-blue-200" />
          ))}
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-4 lg:min-h-[calc(100vh-112px)] lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-14">
          <div className="grid gap-8 lg:gap-12">
            <BrandHero />
            <div className="hidden lg:block">
              <FeatureIntro />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[440px] lg:max-w-none">
            <LoginForm />
          </div>

          <div className="lg:hidden">
            <FeatureIntro />
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandHero() {
  return (
    <section className="mx-auto flex max-w-[520px] flex-col items-center text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
      <div className="flex items-center justify-center gap-3 sm:gap-6 lg:justify-start">
        <Image
          src="/kakin_checker_logo_mark_flat.svg"
          alt="課金チェッカー"
          width={156}
          height={156}
          priority
          className="h-14 w-14 shrink-0 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
        />
        <h1 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
          課金チェッカー
        </h1>
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-950 sm:mt-5 sm:text-xl">
        データで見える、スマートに課金管理を。
      </p>
    </section>
  );
}

function FeatureIntro() {
  return (
    <section className="mx-auto max-w-[720px] lg:mx-0 mb-4">
      <div className="h-1 w-16 rounded-full bg-blue-600" />
      <h2 className="mt-8 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
        毎月の課金を見える化して、無理のない管理を。
      </h2>
      <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
        アプリごとの課金履歴を記録し、月別に支出の傾向を確認できます。
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article key={feature.title} className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
                <Icon size={27} strokeWidth={2.1} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
