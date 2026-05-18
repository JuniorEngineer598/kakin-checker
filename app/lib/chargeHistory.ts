import {
  formatChargeDateLabel,
  formatChargeMonthLabel,
  formatWeekdayLabel,
  parseChargeDate,
} from './format';
import type { ChargeHistoryGroup, ChargeRecord, Game } from './types';

export type ChargeHistoryData = {
  groupsByMonth: Record<string, ChargeHistoryGroup[]>;
};

// 課金記録とゲームデータを受け取り、課金履歴表示用のデータ構造に変換する関数
export function buildChargeHistory(charges: ChargeRecord[], games: Game[]): ChargeHistoryData {
  //ゲームをIDで検索しやすい形に変換 例:gameById.get(charge.gameId)
  const gameById = new Map(games.map((game) => [game.id, game]));

  //月ごとの課金履歴グループを入れるオブジェクト
  const groupsByMonth: Record<string, ChargeHistoryGroup[]> = {};

  //課金記録を日付の新しい順にソート b - a で新しい順
  const sortedCharges = [...charges].sort((a, b) => {
    return parseChargeDate(b.chargedAt).getTime() - parseChargeDate(a.chargedAt).getTime();
  });

  //並び替えた課金データを1件ずつ処理して、月ごと・日付ごとにグループ化
  for (const charge of sortedCharges) {
    const date = parseChargeDate(charge.chargedAt);

    const monthLabel = formatChargeMonthLabel(date);//"2026年5月"
    const dateLabel = formatChargeDateLabel(date);//"2026年5月18日"
    const game = gameById.get(charge.gameId);

    if (!game) {
      continue;
    }

    //月ごとの配列を作成「なければ空の配列を作成」
    groupsByMonth[monthLabel] ??= [];

    //同じ日付のグループを月ごとの配列から検索
    let dateGroup = groupsByMonth[monthLabel].find((item) => item.date === dateLabel);
    if (!dateGroup) {
      dateGroup = {
        date: dateLabel,
        weekday: formatWeekdayLabel(date),
        items: [],
      };
      
      groupsByMonth[monthLabel].push(dateGroup);
    }

    
    dateGroup.items.push({
      id: charge.id,
      gameName: game.name,
      gameIcon: game.icon,
      itemName: charge.itemName,
      amount: charge.amount,
    });
  }

  return {
    groupsByMonth,
  };
}