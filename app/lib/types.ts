// アプリ型
export type App = {
  id: string;
  name: string;
  icon: AppIcon;
  createdAt: string;
};

//課金テンプレート型
export type ChargeTemplate = {
  id: string;
  appId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
  name?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ChargeCategory =
  | 'ガチャ石'
  | '月パス'
  | 'サブスク'
  | 'スキン'
  | 'アイテム'
  | 'その他';

//課金記録型
export type ChargeRecord = {
  id: string;
  appId: string;
  itemName: string;
  amount: number;
  category: ChargeCategory;
  chargedAt: string;
  createdAt: string;
};

export type ActiveTab = 'template' | 'new';

export type DefaultAppIconKey = 'gamepad' | 'sparkles' | 'sword' | 'gem' | 'crown';

export type AppIcon =
  | {
      type: 'default';
      key: DefaultAppIconKey;
    }
  | {
      type: 'upload';
      imageUrl: string;
    };

// 課金履歴の型
export type ChargeHistoryItem = {
  id: string;
  appName: string;
  appIcon: AppIcon;
  itemName: string;
  amount: number;
};

//同じ日付の課金履歴をまとめるための型
export type ChargeHistoryGroup = {
  date: string;
  weekday: string;
  items: ChargeHistoryItem[];
};
