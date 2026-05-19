import type { ChargeRecord, Game, GameIcon } from './types';

export type CalendarChargeItem = {
  id: string;
  gameName: string;
  gameIcon: GameIcon;
  itemName: string;
  category: ChargeRecord['category'];
  amount: number;
};

export type CalendarDayData = {
  date: string;
  totalAmount: number;
  chargeCount: number;
  items: CalendarChargeItem[];
};

export type CalendarDateCell = {
  date: string | null;
  day: number | null;
  dayData: CalendarDayData | null;
};

// 課金データを日付ごとにまとめる
export function buildCalendarDayData(charges: ChargeRecord[], games: Game[]): Record<string, CalendarDayData> {
  const gameById = new Map(games.map((game) => [game.id, game]));
  // 日付ごとのデータを入れるオブジェクト。Recordで「日付キー → 1日分のデータ」の形にする
  const dayDataByDate: Record<string, CalendarDayData> = {};

  //課金データを1件ずつ見て、日付ごとの合計・件数・内訳にまとめる
  for (const charge of charges) {
    const game = gameById.get(charge.gameId);

    if (!game) {
      continue;
    }

    //日付ごとの箱を作る処理
    dayDataByDate[charge.chargedAt] ??= {
      date: charge.chargedAt,
      totalAmount: 0,
      chargeCount: 0,
      items: [],
    };

    const dayData = dayDataByDate[charge.chargedAt];

    dayData.totalAmount += charge.amount;
    dayData.chargeCount += 1;

    dayData.items.push({
      id: charge.id,
      gameName: game.name,
      gameIcon: game.icon,
      itemName: charge.itemName,
      category: charge.category,
      amount: charge.amount,
    });
  }

  return dayDataByDate;
}

//1日〜月末までのカレンダーマスを作る 5月1日〜5月31日
export function buildCalendarDateCells(
  monthDate: Date,
  dayDataByDate: Record<string, CalendarDayData>,
): CalendarDateCell[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  //月の初めの曜日を取得
  const firstWeekday = new Date(year, month, 1).getDay();
  //月の最後の日付を取得
  const lastDate = new Date(year, month + 1, 0).getDate();
  const cells: CalendarDateCell[] = [];

  // 空マスを埋める処理
  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push({
      date: null,
      day: null,
      dayData: null,
    });
  }

  // 日付マスを作る処理
  for (let day = 1; day <= lastDate; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    cells.push({
      date,
      day,
      dayData: dayDataByDate[date] ?? null,
    });
  }
  return cells;
}

//Map = 関数内で使う一時的な検索・集計用
//Record = 日付キーで取り出すために画面側へ返すデータ
