export type Game = {
  id: string;
  name: string;
  createdAt: string;
};

export type ChargeTemplate = {
  id: string;
  gameId: string;
  itemName: string;
  amount: number;
  category: string;
  memo?: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ChargeRecord = {
  id: string;
  gameId: string;
  itemName: string;
  amount: number;
  category: string;
  chargedAt: string;
  memo?: string;
  createdAt: string;
};

const STORAGE_KEYS = {
  games: 'kakin-checker:games',
  chargeTemplates: 'kakin-checker:chargeTemplates',
  charges: 'kakin-checker:charges',
} as const;

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
    memo: '毎月更新',
    createdAt: now,
  },
  {
    id: 'template-genshin-battlepass',
    gameId: 'game-genshin',
    itemName: '紀行',
    amount: 1220,
    category: '月パス',
    memo: 'シーズン更新',
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

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadGames() {
  return readJson<Game[]>(STORAGE_KEYS.games, defaultGames);
}

// ローカルストレージ保存
export function saveGames(games: Game[]) {
  writeJson(STORAGE_KEYS.games, games);
}

export function loadChargeTemplates() {
  return readJson<ChargeTemplate[]>(STORAGE_KEYS.chargeTemplates, defaultChargeTemplates);
}

export function saveChargeTemplates(templates: ChargeTemplate[]) {
  writeJson(STORAGE_KEYS.chargeTemplates, templates);
}

export function loadCharges() {
  return readJson<ChargeRecord[]>(STORAGE_KEYS.charges, []);
}

export function saveCharges(charges: ChargeRecord[]) {
  writeJson(STORAGE_KEYS.charges, charges);
}
