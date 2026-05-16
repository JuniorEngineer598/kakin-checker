'use client';

import { EllipsisVertical, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { formatCurrency, formatDateInputValue } from '../../../lib/format';
import { chargeCategories } from '../../../lib/chargeCategories';
import {
  createId,
  loadCharges,
  loadChargeTemplates,
  loadGames,
  saveCharges,
  saveChargeTemplates, 
} from '../../../lib/storage';
import type { ChargeCategory, ChargeRecord, ChargeTemplate, Game } from '../../../lib/types';


export default function TemplateChargeList() {
  const [openTemplateMenuId, setOpenTemplateMenuId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ChargeTemplate[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [dateTemplateId, setDateTemplateId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => formatDateInputValue(new Date()));// 日付指定モーダルで選択された日付
  const [editTemplateId, setEditTemplateId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<ChargeCategory>('ガチャ');

  // ゲーム選択に応じてテンプレートをフィルタリング
  const filteredTemplates = selectedGameId
    ? templates.filter((template) => template.gameId === selectedGameId)
    : templates;

  // ゲームデータとテンプレートの読み込み
  useEffect(() => {
    const loadedGames = loadGames();
    const loadedTemplates = loadChargeTemplates();

    setGames(loadedGames);
    setTemplates(loadedTemplates);
    setSelectedGameId(loadedGames[0]?.id ?? '');// 最初のゲームを選択状態にする
  }, []);

  // テンプレートから課金データを追加  第２引数がある場合はその日付で追加、ない場合は当日で追加
  function handleAddTemplate(template: ChargeTemplate, chargedAt = formatDateInputValue(new Date())) {
    // バリデーション
    if (!chargedAt) {
      return;
    }

    const now = new Date();
    const createdAt = now.toISOString(); //作成日時
    
    const newCharge: ChargeRecord = {
      id: createId('charge'),// 例: "charge-1625239072345-abc123"
      gameId: template.gameId,
      itemName: template.itemName,
      amount: template.amount,
      category: template.category,
      chargedAt,
      createdAt,
    };

    saveCharges([...loadCharges(), newCharge]);
    setOpenTemplateMenuId(null);
    setDateTemplateId(null);
  }

  // テンプレートの消去
  function handleDeleteTemplate(templateId: string) {
    const nextTemplates = templates.filter((template) => template.id !== templateId);
    saveChargeTemplates(nextTemplates);
    setTemplates(nextTemplates);
    setOpenTemplateMenuId(null);
  }

  // 日付指定モーダルの開閉
  function openDateModal(templateId: string) {
    setSelectedDate(formatDateInputValue(new Date()));
    setDateTemplateId(templateId);
    setOpenTemplateMenuId(null);
  }

  // 日付指定モーダルを閉じる
  function closeDateModal() {
    setDateTemplateId(null);
  }

  // 編集モーダルの開閉と編集対象テンプレートのセット
  function openEditModal(template: ChargeTemplate) {
    setEditTemplateId(template.id);// 編集するテンプレートのIDをセット
    setEditItemName(template.itemName);
    setEditAmount(String(template.amount));
    setEditCategory(template.category);
    setOpenTemplateMenuId(null);
  }

  function closeEditModal() {
    setEditTemplateId(null);
  }

  // 編集内容を保存
  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedItemName = editItemName.trim();
    const numericAmount = Number(editAmount);
    // バリデーション
    if (!trimmedItemName || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }
    const updatedTemplates = templates.map((template) => {
      if (template.id === editTemplateId) {
        return {
          ...template,
          itemName: trimmedItemName,
          amount: numericAmount,
          category: editCategory,
          updatedAt: new Date().toISOString(),
        };
      }
      return template;// 変更のないテンプレートはそのまま返す mapは必須
    });
    //updatedTemplatesは更新後と既存のテンプレートどちらも返す。
    saveChargeTemplates(updatedTemplates);
    setTemplates(updatedTemplates);
    closeEditModal();
  }

  // 日付指定モーダルに表示するテンプレートデータ
  const dateTemplate = templates.find((template) => template.id === dateTemplateId);

  return (
    <div className="grid gap-4">
      <section className="flex h-[670px] flex-col rounded-[28px] bg-white p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-700">ゲームを選択</span>
        </div>

        <label className="block">
          <select
            value={selectedGameId}
            onChange={(event) => setSelectedGameId(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-slate-400 focus:bg-white"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 flex min-h-0 flex-1 flex-col">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-950">テンプレート一覧</h2>
            <p className="text-sm font-semibold text-slate-500">{games.find((game) => game.id === selectedGameId)?.name}</p>
          </div>

          <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto pr-1">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-slate-300 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddTemplate(template);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-base font-bold text-slate-950">{template.itemName}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {template.category} {formatCurrency(template.amount)}
                    </p>
                  </button>

                  <div className="relative shrink-0">
                    <button
                      type="button"
                      title="メニュー"
                      aria-label={`${template.itemName}のメニュー`}
                      aria-expanded={openTemplateMenuId === template.id}
                      onClick={() => {
                        setOpenTemplateMenuId((current) => (current === template.id ? null : template.id));
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                    >
                      <EllipsisVertical className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {openTemplateMenuId === template.id ? (
                      <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                        >
                          消去
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(template)}
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          編集
                        </button>
                        <button
                          type="button"
                          onClick={() => openDateModal(template.id)}
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

      {dateTemplate ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-950">追加日を指定</h2>
              <button
                type="button"
                onClick={closeDateModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-500">この課金の追加日を選択してください。</p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="truncate text-sm font-bold text-slate-950">{dateTemplate.itemName}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {dateTemplate.category} {formatCurrency(dateTemplate.amount)}
              </p>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-5 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-400"
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeDateModal}
                className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                戻る
              </button>
              <button
                type="button"
                onClick={() => {handleAddTemplate(dateTemplate, selectedDate)}}
                className="h-12 rounded-xl bg-slate-950 text-sm font-bold text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
              >
                追加する
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editTemplateId ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-950">テンプレートを編集</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-500">テンプレートの内容を変更できます。</p>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">アイテム名</span>
                <input
                  type="text"
                  value={editItemName}
                  onChange={(event) => setEditItemName(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">金額</span>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(event) => setEditAmount(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-400"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">カテゴリ</span>
                <select
                  value={editCategory}
                  onChange={(event) => setEditCategory(event.target.value as ChargeCategory)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 outline-none transition focus:border-slate-400"
                >
                  {chargeCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="h-12 rounded-xl bg-slate-950 text-sm font-bold text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
