'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { chargeCategories } from '../../../lib/chargeCategories';
import type { ChargeCategory, ChargeRecord, ChargeTemplate, Game } from '../../../lib/types';
import { formatDateInputValue } from '../../../lib/format';
import {
  createId,
  loadCharges,
  loadChargeTemplates,
  loadGames,
  saveCharges,
  saveChargeTemplates,
} from '../../../lib/storage';


export default function NewChargeForm() {
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState('');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [chargedAt, setChargedAt] = useState(formatDateInputValue(new Date()));
  const [category, setCategory] = useState<ChargeCategory>('ガチャ');
  const [shouldSaveAsTemplate, setShouldSaveAsTemplate] = useState(false);

  // ゲームデータの読み込み
  useEffect(() => {
    const loadedGames = loadGames();
    setGames(loadedGames);
    setGameId((current) => current || loadedGames[0]?.id || '');
  }, []);

  // フォーム送信
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedItemName = itemName.trim();
    const numericAmount = Number(amount);
    // バリデーション
    if (!gameId || !trimmedItemName || !Number.isFinite(numericAmount) || numericAmount <= 0 || !chargedAt) {
      return;
    }

    const createdAt = new Date().toISOString(); // 作成日時

    // 登録する課金データの作成
    const newCharge: ChargeRecord = {
      id: createId('charge'),
      gameId,
      itemName: trimmedItemName,
      amount: numericAmount,
      category,
      chargedAt,
      createdAt,
    };

    saveCharges([...loadCharges(), newCharge]);

    // テンプレートとして保存する場合の処理
    if (shouldSaveAsTemplate) {
      const newTemplate: ChargeTemplate = {
        id: createId('template'),
        gameId,
        itemName: trimmedItemName,
        amount: numericAmount,
        category,
        createdAt,
      };

      saveChargeTemplates([...loadChargeTemplates(), newTemplate]);
    }

    setItemName('');
    setAmount('');
    setCategory('ガチャ');
    setShouldSaveAsTemplate(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] bg-white p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-5"
    >
      <h2 className="text-base font-bold text-slate-950">新規で追加</h2>

      <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">ゲーム</span>
          <select
            value={gameId}
            onChange={(event) => setGameId(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">アイテム名</span>
          <input
            type="text"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            placeholder="例: 祝福パック"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">金額</span>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="例: 980"
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">課金日</span>
          <input
            type="date"
            value={chargedAt}
            onChange={(event) => setChargedAt(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">カテゴリ</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as ChargeCategory)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            {chargeCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <input 
            type="checkbox" 
            checked={shouldSaveAsTemplate}
            onChange={(event) => setShouldSaveAsTemplate(event.target.checked)}
            className="h-4 w-4 accent-slate-900" />
            この内容をテンプレートとして保存する
        </label>

        <button
          type="submit"
          className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
        >
          登録
        </button>
      </div>
    </form>
  );
}
