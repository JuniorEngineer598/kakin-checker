import type { ChargeTemplate, Game } from './types';

const now = new Date().toISOString();

export const defaultGames: Game[] = [
  { id: 'game-genshin', name: '原神', createdAt: now },
  { id: 'game-bluearchive', name: 'ブルアカ', createdAt: now },
  { id: 'game-monsterstrike', name: 'モンスト', createdAt: now },
  { id: 'game-nikke', name: 'NIKKE', createdAt: now },
];

export const defaultChargeTemplates: ChargeTemplate[] = [
  {
    id: 'template-genshin-welkin',
    gameId: 'game-genshin',
    itemName: '祝福パック',
    amount: 980,
    category: '月パス',
    createdAt: now,
  },
  {
    id: 'template-genshin-battlepass',
    gameId: 'game-genshin',
    itemName: '紀行',
    amount: 1220,
    category: '月パス',
    createdAt: now,
  },
  {
    id: 'template-genshin-crystal',
    gameId: 'game-genshin',
    itemName: '創世結晶',
    amount: 6100,
    category: 'ガチャ',
    createdAt: now,
  },
  {
    id: 'template-bluearchive-pack',
    gameId: 'game-bluearchive',
    itemName: 'マンスリーパッケージ',
    amount: 1000,
    category: '月パス',
    createdAt: now,
  },
];
