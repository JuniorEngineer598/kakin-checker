'use client';

import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import PageBackground from "../../../components/PageBackground";
import type { ActiveTab } from '../../../lib/types';
import NewChargeForm from './NewChargeForm';
import TemplateChargeList from './TemplateChargeList';

export default function NewChargePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('template');

  // タブ切り替え
  function handleTabChange(nextTab: ActiveTab) {
    setActiveTab(nextTab);
  }

  return (
    <PageBackground className="px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <PlusCircle size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">課金追加</h1>
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

        {activeTab === 'template' ? <TemplateChargeList /> : <NewChargeForm />}
      </div>
    </PageBackground>
  );
}
