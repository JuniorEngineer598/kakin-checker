"use client";

import {
  AppWindow,
  CheckCircle2,
  EllipsisVertical,
  Plus,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { formatCurrency } from "../../lib/format";
import {
  createId,
  loadGames,
  saveGames,
  loadCharges,
  saveCharges,
  loadChargeTemplates,
  saveChargeTemplates,
} from "../../lib/storage";
import type { ChargeRecord, Game } from "../../lib/types";
import { getNextDefaultGameIconKey } from "../../lib/gameIcons";
import GameIconView from "../../components/GameIconView";
import PageBackground from "../../components/PageBackground";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  const [gameName, setGameName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openGameMenuId, setOpenGameMenuId] = useState<string | null>(null);
  const [gameNameError, setGameNameError] = useState("");
  const [editGameId, setEditGameId] = useState<string | null>(null);
  const [editGameName, setEditGameName] = useState("");
  const [editGameNameError, setEditGameNameError] = useState("");

  useEffect(() => {
    setGames(loadGames());
    setCharges(loadCharges());
  }, []);

  // 新しいアプリを追加する処理
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = gameName.trim();
    if (!trimmedName) {
      setGameNameError("※アプリ名を入力してください");
      return;
    }
    // 同じ名前のアプリが既に存在するかチェック
    const existsGame = games.find((game) => game.name === trimmedName);
    if (existsGame) {
      setGameNameError("※同じ名前のアプリが既に存在しています");
      return;
    }

    const newGame: Game = {
      id: createId("game"),
      name: trimmedName,
      icon: {
        type: "default",
        key: getNextDefaultGameIconKey(games.length),
      },
      createdAt: new Date().toISOString(),
    };

    const nextGames = [...games, newGame];

    setGames(nextGames);
    saveGames(nextGames);
    setGameName("");
    setIsModalOpen(false);
    setOpenGameMenuId(null);
  }

  // アプリを削除する処理
  const handleDeleteGame = (gameId: string) => {
    // アプリを削除する前に確認ダイアログを表示
    const ok = window.confirm(
      "このアプリを本当に削除しますか？\n※このアプリの課金履歴とテンプレートも削除されます",
    );
    if (!ok) return;

    // アプリを削除した後、そのアプリに関連する課金記録と課金テンプレートも削除
    const nextGames = games.filter((game) => game.id !== gameId);
    const nextCharges = loadCharges().filter(
      (charge) => charge.gameId !== gameId,
    );
    const nextChargeTemplates = loadChargeTemplates().filter(
      (template) => template.gameId !== gameId,
    );
    setGames(nextGames);
    saveGames(nextGames);
    setCharges(nextCharges);
    saveCharges(nextCharges);
    saveChargeTemplates(nextChargeTemplates);
    setOpenGameMenuId(null);
  };

  // アプリ編集モーダルを開く処理
  const openEditModal = (game: Game) => {
    setEditGameId(game.id);
    setEditGameName(game.name);
    setEditGameNameError("");
    setOpenGameMenuId(null);
  };

  function closeEditModal() {
    setEditGameId(null);
    setEditGameName("");
    setEditGameNameError("");
  }

  // アプリ名を編集して保存する処理
  const handleEditSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = editGameName.trim();
    // アプリ名が空の場合はエラーを表示して保存処理を中断
    if (!trimmedName) {
      setEditGameNameError("※アプリ名を入力してください");
      return;
    }

    // 同じ名前のアプリが既に存在するかチェック
    const existsGame = games.find(
      (game) => game.id !== editGameId && game.name === trimmedName,
    );
    if (existsGame) {
      setEditGameNameError("※同じ名前のアプリが既に存在しています");
      return;
    }

    // アプリ名を更新した新しいアプリの配列を作成
    const nextGames = games.map((game) => {
      if (game.id === editGameId) {
        return {
          ...game,
          name: trimmedName,
        };
      }

      return game;
    });

    setGames(nextGames);
    saveGames(nextGames);
    closeEditModal();
  };

  // アプリごとの総課金額を計算
  function getGameTotalAmount(gameId: string) {
    return charges
      .filter((charge) => charge.gameId === gameId)
      .reduce((total, charge) => total + charge.amount, 0);
  }

  return (
    <PageBackground className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <AppWindow size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">アプリ追加</h1>
        </div>

        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">登録済みのアプリ</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
          >
            <Plus size={19} strokeWidth={2.3} aria-hidden="true" />
            追加
          </button>
        </div>

        <section className="overflow-visible rounded-[28px] bg-white px-3 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:px-6 md:overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_72px_40px_36px] items-center gap-3 border-b border-slate-200 px-1 py-4 text-[11px] font-bold text-slate-500 sm:grid-cols-[minmax(0,1fr)_88px_48px_40px] sm:gap-4 sm:px-2 md:hidden">
            <div className="flex items-center gap-2">
              <AppWindow size={14} strokeWidth={2.2} aria-hidden="true" />
              アプリ
            </div>
            <div className="justify-self-end">総課金額</div>
            <div className="justify-self-center">登録</div>
            <div className="justify-self-end">操作</div>
          </div>

          <div className="hidden grid-cols-[minmax(0,1.2fr)_160px_160px_120px] border-b border-slate-200 px-2 py-5 text-sm font-bold text-slate-500 md:grid">
            <div className="flex items-center gap-3">
              <AppWindow size={18} strokeWidth={2.2} aria-hidden="true" />
              アプリ名
            </div>
            <div>総課金額</div>
            <div>登録状況</div>
            <div>操作</div>
          </div>

          <div>
            {games.map((game) => {
              return (
                <article
                  key={game.id}
                  className="grid grid-cols-[minmax(0,1fr)_72px_40px_36px] items-center gap-3 border-b border-slate-200 px-1 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_88px_48px_40px] sm:gap-4 sm:px-2 md:grid-cols-[minmax(0,1.2fr)_160px_160px_120px] md:gap-0 md:py-5"
                >
                  <div className="flex min-w-0 items-center gap-3 md:gap-5">
                    <GameIconView icon={game.icon} className="h-11 w-11 shrink-0 md:h-14 md:w-14" />
                    <p className="min-w-0 truncate text-sm font-bold text-slate-950 sm:text-base md:text-lg">
                      {game.name}
                    </p>
                  </div>

                  <p className="justify-self-end text-right text-sm font-bold text-slate-900 sm:text-base md:justify-self-auto md:text-left">
                    {formatCurrency(getGameTotalAmount(game.id))}
                  </p>

                  <div className="flex justify-center justify-self-center md:block md:justify-self-auto">
                    <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100 md:inline-flex">
                      <CheckCircle2
                        size={15}
                        strokeWidth={2.4}
                        className="text-emerald-500"
                        aria-hidden="true"
                      />
                      登録済み
                    </span>
                    <CheckCircle2
                      size={20}
                      strokeWidth={2.4}
                      className="text-emerald-500 md:hidden"
                      aria-label="登録済み"
                    />
                  </div>

                  <div className="relative w-fit justify-self-end md:justify-self-auto">
                    <button
                      type="button"
                      title="メニュー"
                      aria-label={`${game.name}のメニュー`}
                      aria-expanded={openGameMenuId === game.id}
                      onClick={() => {
                        setOpenGameMenuId((current) =>
                          current === game.id ? null : game.id,
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <EllipsisVertical
                        size={19}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </button>

                    {openGameMenuId === game.id ? (
                      <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                        <button
                          type="button"
                          onClick={() => openEditModal(game)}
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGame(game.id)}
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

          <div className="px-2 py-5 text-center text-sm font-bold text-slate-600">
            合計 {games.length} 件
          </div>
        </section>

        {isModalOpen ? (
          <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 pb-4 pt-20 backdrop-blur-[2px] sm:items-center sm:py-6">
            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100dvh-96px)] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-4 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-h-[calc(100dvh-48px)] sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  アプリを追加
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 transition hover:text-slate-950"
                  aria-label="閉じる"
                >
                  <X size={24} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>

              <label className="mt-6 block sm:mt-8">
                <span className="text-sm font-bold text-slate-700">
                  アプリ名
                </span>
                <input
                  type="text"
                  name="gameName"
                  value={gameName}
                  onChange={(event) => {
                    setGameName(event.target.value);
                    setGameNameError("");
                  }}
                  placeholder="例: スターレイル"
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
                {gameNameError && (
                  <p className="mt-2 text-sm font-bold text-rose-600">
                    {gameNameError}
                  </p>
                )}
              </label>

              <div className="mt-6 sm:mt-7">
                <p className="text-sm font-bold text-slate-700">アイコン画像</p>
                <div className="mt-3 grid grid-cols-[minmax(0,7fr)_minmax(88px,3fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_112px] sm:gap-4">
                  <button
                    type="button"
                    className="flex min-h-[112px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-3 text-center transition hover:border-slate-400 hover:bg-slate-50 sm:min-h-[170px] sm:rounded-2xl sm:px-5"
                  >
                    <UploadCloud
                      size={28}
                      strokeWidth={2}
                      className="text-slate-600 sm:h-[34px] sm:w-[34px]"
                      aria-hidden="true"
                    />
                    <span className="mt-2 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                      画像をアップロード
                    </span>
                    <span className="mt-3 hidden text-xs font-semibold text-slate-500 sm:block">
                      ドラッグ & ドロップまたはクリックして選択
                    </span>
                    <span className="mt-1 text-[10px] font-semibold text-slate-400 sm:mt-2 sm:text-xs">
                      JPG, PNG
                    </span>
                  </button>

                  <div className="flex flex-col items-center gap-3">
                    <div className="aspect-square w-full rounded-xl border border-slate-200 bg-white sm:h-28 sm:w-28 sm:rounded-2xl" />
                    <p className="text-xs font-semibold text-slate-500">
                      プレビュー
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 sm:mt-8">
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
        {editGameId ? (
          <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-4 pb-4 pt-20 backdrop-blur-[2px] sm:items-center sm:py-6">
            <form
              onSubmit={handleEditSubmit}
              className="max-h-[calc(100dvh-96px)] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-4 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-h-[calc(100dvh-48px)] sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  アプリ名を編集
                </h2>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-slate-500 transition hover:text-slate-950"
                  aria-label="閉じる"
                >
                  <X size={24} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>

              <label className="mt-6 block sm:mt-8">
                <span className="text-sm font-bold text-slate-700">
                  アプリ名
                </span>
                <input
                  type="text"
                  value={editGameName}
                  onChange={(event) => {
                    setEditGameName(event.target.value);
                    setEditGameNameError("");
                  }}
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
                {editGameNameError ? (
                  <p className="mt-2 text-sm font-bold text-rose-600">
                    {editGameNameError}
                  </p>
                ) : null}
              </label>

              <div className="mt-6 flex justify-end gap-3 sm:mt-8">
                <button
                  type="button"
                  onClick={closeEditModal}
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
    </PageBackground>
  );
}
