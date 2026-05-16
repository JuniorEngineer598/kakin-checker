'use client';

import { CheckCircle2, EllipsisVertical, Gamepad2, Plus, UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { formatCurrency } from '../../lib/format';
import { mockGameIconStyles, mockGameTotalAmounts } from '../../lib/mockData';
import { createId, loadGames, saveGames } from '../../lib/storage';
import type { Game } from '../../lib/types';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [gameName, setGameName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openGameMenuId, setOpenGameMenuId] = useState<string | null>(null);

  useEffect(() => {
    setGames(loadGames());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = gameName.trim();
    if (!trimmedName) {
      return;
    }

    const nextGames = [
      ...games,
      {
        id: createId('game'),
        name: trimmedName,
        createdAt: new Date().toISOString(),
      },
    ];

    setGames(nextGames);
    saveGames(nextGames);
    setGameName('');
    setIsModalOpen(false);
    setOpenGameMenuId(null);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div>
            <p className="text-sm font-semibold text-slate-500">Games</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">ゲーム追加</h1>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">登録済みのゲーム</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
          >
            <Plus size={19} strokeWidth={2.3} aria-hidden="true" />
            追加
          </button>
        </div>

        <section className="overflow-hidden rounded-[28px] bg-white px-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="grid grid-cols-[minmax(0,1.2fr)_160px_160px_120px] border-b border-slate-200 px-2 py-5 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-3">
              <Gamepad2 size={18} strokeWidth={2.2} aria-hidden="true" />
              ゲーム名
            </div>
            <div>総課金額</div>
            <div>登録状況</div>
            <div>操作</div>
          </div>

          <div>
            {games.map((game, index) => {
              const iconStyle = mockGameIconStyles[index % mockGameIconStyles.length];
              const Icon = iconStyle.icon;

              return (
                <article
                  key={game.id}
                  className="grid grid-cols-[minmax(0,1.2fr)_160px_160px_120px] items-center border-b border-slate-200 px-2 py-5 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ring-1 ${iconStyle.className}`}>
                      <Icon size={25} strokeWidth={2.2} aria-hidden="true" />
                    </div>
                    <p className="min-w-0 truncate text-lg font-bold text-slate-950">{game.name}</p>
                  </div>

                  <p className="text-base font-bold text-slate-900">
                    {formatCurrency(mockGameTotalAmounts[index % mockGameTotalAmounts.length])}
                  </p>

                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                      <CheckCircle2 size={15} strokeWidth={2.4} className="text-emerald-500" aria-hidden="true" />
                      登録済み
                    </span>
                  </div>

                  <div className="relative w-fit">
                    <button
                      type="button"
                      title="メニュー"
                      aria-label={`${game.name}のメニュー`}
                      aria-expanded={openGameMenuId === game.id}
                      onClick={() => {
                        setOpenGameMenuId((current) => (current === game.id ? null : game.id));
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <EllipsisVertical size={19} strokeWidth={2.2} aria-hidden="true" />
                    </button>

                    {openGameMenuId === game.id ? (
                      <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                        <button
                          type="button"
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                        >
                          消去
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="px-2 py-5 text-center text-sm font-bold text-slate-600">合計 {games.length} 件</div>
        </section>

        {isModalOpen ? (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl rounded-[28px] bg-white p-7 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)]"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-950">ゲームを追加</h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 transition hover:text-slate-950"
                  aria-label="閉じる"
                >
                  <X size={24} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>

              <label className="mt-8 block">
                <span className="text-sm font-bold text-slate-700">ゲーム名</span>
                <input
                  type="text"
                  name="gameName"
                  value={gameName}
                  onChange={(event) => setGameName(event.target.value)}
                  placeholder="例: スターレイル"
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
              </label>

              <div className="mt-7">
                <p className="text-sm font-bold text-slate-700">アイコン画像</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_112px]">
                  <button
                    type="button"
                    className="flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <UploadCloud size={34} strokeWidth={2} className="text-slate-600" aria-hidden="true" />
                    <span className="mt-4 text-sm font-bold text-slate-800">画像をアップロード</span>
                    <span className="mt-3 text-xs font-semibold text-slate-500">ドラッグ & ドロップまたはクリックして選択</span>
                    <span className="mt-2 text-xs font-semibold text-slate-400">推奨サイズ: 512x512px / JPG, PNG</span>
                  </button>

                  <div className="flex flex-col items-center gap-3">
                    <div className="h-28 w-28 rounded-2xl border border-slate-200 bg-white" />
                    <p className="text-xs font-semibold text-slate-500">プレビュー</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-slate-950 px-10 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
