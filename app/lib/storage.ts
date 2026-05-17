
import type { ChargeRecord, ChargeTemplate, Game } from './types';

// ローカルストレージのキーを定義
const STORAGE_KEYS = {
  games: 'kakin-checker:games',
  chargeTemplates: 'kakin-checker:chargeTemplates',
  charges: 'kakin-checker:charges',
} as const;

// IDを生成するユーティリティ関数
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

// Next.js ではサーバー側で実行されることがある。
// サーバー側には window / localStorage が存在しないため、ここで処理を止める。
function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
// ゲームデータをローカルストレージから読み込み
export function loadGames() {
  return readJson<Game[]>(STORAGE_KEYS.games, []);
}

// ゲームデータをローカルストレージに保存
export function saveGames(games: Game[]) {
  writeJson(STORAGE_KEYS.games, games);
}

// 課金テンプレートをローカルストレージから読み込み
export function loadChargeTemplates() {
  return readJson<ChargeTemplate[]>(STORAGE_KEYS.chargeTemplates, []);
}

// 課金テンプレートをローカルストレージに保存
export function saveChargeTemplates(templates: ChargeTemplate[]) {
  writeJson(STORAGE_KEYS.chargeTemplates, templates);
}

// 課金データをローカルストレージから読み込み
export function loadCharges() {
  return readJson<ChargeRecord[]>(STORAGE_KEYS.charges, []);
}

// 課金をローカルストレージに保存
export function saveCharges(charges: ChargeRecord[]) {
  writeJson(STORAGE_KEYS.charges, charges);
}
