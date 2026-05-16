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
  category: ChargeCategory;
  name?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ChargeCategory = 'ガチャ' | '月パス' | 'スキン' | 'アイテム' | 'その他';

export type ChargeRecord = {
  id: string;
  gameId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
  chargedAt: string;
  createdAt: string;
};

export type ActiveTab = 'template' | 'new';