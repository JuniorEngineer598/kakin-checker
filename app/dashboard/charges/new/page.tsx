'use client';

import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

type ActiveTab = 'template' | 'new';

const dummyGames = ['原神', 'ブルアカ', 'モンスト', 'NIKKE'];

const dummyTemplates = [
  { name: '祝福パック', amount: 980, category: '月パス', memo: '毎月更新' },
  { name: '紀行', amount: 1220, category: '月パス', memo: 'シーズン更新' },
  { name: '創世結晶', amount: 6100, category: 'ガチャ石', memo: 'イベント用' },
];

function formatCurrency(value: number) {
  return `¥${value.toLocaleString()}`;
}

export default function NewChargePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('template');
  const [selectedTemplateName, setSelectedTemplateName] = useState(dummyTemplates[0].name);
  const [openTemplateMenuName, setOpenTemplateMenuName] = useState<string | null>(null);
  const selectedTemplate = dummyTemplates.find((template) => template.name === selectedTemplateName) ?? dummyTemplates[0];

  function handleTabChange(nextTab: ActiveTab) {
    setActiveTab(nextTab);
    setOpenTemplateMenuName(null);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Charges</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">課金追加</h1>
          </div>

        </div>

        <div className="mb-4 grid grid-cols-2 rounded-2xl bg-white p-1 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.45)]">
          <button
            type="button"
            onClick={() => handleTabChange('template')}
            className={`h-10 rounded-xl text-sm font-bold transition ${
              activeTab === 'template' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            テンプレートから追加
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('new')}
            className={`h-10 rounded-xl text-sm font-bold transition ${
              activeTab === 'new' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            新規で追加
          </button>
        </div>

        {activeTab === 'template' ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
            <section className="flex h-[670px] flex-col rounded-[28px] bg-white p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700">ゲームを選択</span>
              </div>

              <label className="block">
                <select
                  defaultValue="原神"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
                >
                  {dummyGames.map((game) => (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 flex min-h-0 flex-1 flex-col">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-base font-bold text-slate-950">テンプレート一覧</h2>
                  <p className="text-sm font-semibold text-slate-500">原神</p>
                </div>

                <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto pr-1">
                  {dummyTemplates.map((template) => (
                    <article
                      key={template.name}
                      className={`rounded-2xl border bg-slate-50 p-3.5 transition hover:border-slate-300 hover:bg-white ${
                        selectedTemplate?.name === template.name ? 'border-slate-400 bg-white' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTemplateName(template.name);
                            setOpenTemplateMenuName(null);
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-base font-bold text-slate-950">{template.name}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {template.category} {formatCurrency(template.amount)}
                          </p>
                        </button>

                        <div className="relative shrink-0">
                          <button
                            type="button"
                            title="メニュー"
                            aria-label={`${template.name}のメニュー`}
                            aria-expanded={openTemplateMenuName === template.name}
                            onClick={() => {
                              setOpenTemplateMenuName((current) => (current === template.name ? null : template.name));
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                          >
                            <EllipsisVertical className="h-5 w-5" aria-hidden="true" />
                          </button>

                          {openTemplateMenuName === template.name ? (
                            <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                              <button
                                type="button"
                                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                              >
                                消去
                              </button>
                              <button
                                type="button"
                                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                              >
                                編集
                              </button>
                              <button
                                type="button"
                                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                              >
                                日付指定
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {selectedTemplate ? (
              <ChargeForm title="テンプレートから追加" template={selectedTemplate} showSaveAsTemplate={false} />
            ) : (
              <EmptyTemplatePanel />
            )}
          </div>
        ) : (
          <ChargeForm title="新規で追加" template={undefined} showSaveAsTemplate />
        )}
      </div>
    </main>
  );
}

function ChargeForm({
  title,
  template,
  showSaveAsTemplate,
}: {
  title: string;
  template?: (typeof dummyTemplates)[number];
  showSaveAsTemplate: boolean;
}) {
  return (
    <form className="rounded-[28px] bg-white p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-5">
      <h2 className="text-base font-bold text-slate-950">{title}</h2>

      <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">ゲーム</span>
          <select
            defaultValue="原神"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            {dummyGames.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">アイテム名</span>
          <input
            type="text"
            key={template?.name ?? 'new-item'}
            defaultValue={template?.name ?? ''}
            placeholder="例: 祝福パック"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">金額</span>
          <input
            type="number"
            key={`${template?.name ?? 'new'}-amount`}
            defaultValue={template?.amount ?? ''}
            placeholder="例: 980"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">課金日</span>
          <input
            type="date"
            defaultValue="2026-05-14"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">カテゴリ</span>
          <select
            key={`${template?.name ?? 'new'}-category`}
            defaultValue={template?.category ?? 'ガチャ'}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            <option value="ガチャ">ガチャ</option>
            <option value="月パス">月パス</option>
            <option value="スキン">スキン</option>
            <option value="アイテム">アイテム</option>
            <option value="その他">その他</option>
          </select>
        </label>

        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="text-sm font-semibold text-slate-700">メモ</span>
          <textarea
            rows={3}
            key={`${template?.name ?? 'new'}-memo`}
            defaultValue={template?.memo ?? ''}
            placeholder="用途やイベント名など"
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {showSaveAsTemplate ? (
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" className="h-4 w-4 accent-slate-900" />
            この内容をテンプレートとして保存する
          </label>
        ) : (
          <span />
        )}

        <button
          type="button"
          className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
        >
          登録
        </button>
      </div>
    </form>
  );
}

function EmptyTemplatePanel() {
  return (
    <section className="flex min-h-[420px] items-center justify-center rounded-[28px] bg-white p-4 text-center shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-5">
      <p className="max-w-[240px] text-sm font-semibold leading-6 text-slate-400">
        テンプレートがありません。
      </p>
    </section>
  );
}
