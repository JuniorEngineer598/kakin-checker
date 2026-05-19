import { parseChargeDate } from "./format";
import type { ChargeRecord, Game, GameIcon } from "./types";


export type AppChargeTotal = {
  gameId: string;
  gameName: string;
  gameIcon: GameIcon;
  totalAmount: number;
};

export type DashboardStats = {
  appCount: number;
  monthlyChargeCount: number;
  monthlyTotalAmount: number;
  yearlyTotalAmount: number;
  monthlyTopApp: AppChargeTotal | null;
  yearlyTopApp: AppChargeTotal | null;
  monthlyAppTotals: AppChargeTotal[];
};

export function buildDashboardStats(charges: ChargeRecord[], games: Game[]): DashboardStats {
  const today = new Date();

  // 今月の課金記録をフィルタリング
  const monthlyCharges = charges.filter((charge) => {
    // chargedAtをDateオブジェクトに変換して下記で使いやすく
    const chargeDate = parseChargeDate(charge.chargedAt);

    return (
      chargeDate.getFullYear() === today.getFullYear() &&
      chargeDate.getMonth() === today.getMonth()
    );
  });

  // 今年の課金記録をフィルタリング
  const yearlyCharges = charges.filter((charge) => {
    const chargeDate = parseChargeDate(charge.chargedAt);

    return chargeDate.getFullYear() === today.getFullYear();
  });
  
  const monthlyChargeCount = monthlyCharges.length;

  const monthlyTotalAmount = monthlyCharges.reduce((total, charge) => {
    return total + charge.amount;
  }, 0);

  const yearlyTotalAmount = yearlyCharges.reduce((total, charge) => {
    return total + charge.amount;
  }, 0);

  const monthlyAppTotals = buildAppChargeTotals(monthlyCharges, games);
  const yearlyAppTotals = buildAppChargeTotals(yearlyCharges, games);

  const monthlyTopApp = monthlyAppTotals[0] ?? null;
  const yearlyTopApp = yearlyAppTotals[0] ?? null;

  return {
    appCount: games.length,
    monthlyChargeCount,
    monthlyTotalAmount,
    yearlyTotalAmount,
    monthlyTopApp,
    yearlyTopApp,
    monthlyAppTotals,
  };
}


function buildAppChargeTotals(charges: ChargeRecord[], games: Game[]): AppChargeTotal[] {
  //gameIdからアプリ本体を探すMap
  const gameById = new Map(games.map((game) => [game.id, game]));
  //gameIdごとの合計金額を保存するMap
  const totalByGameId = new Map<string, number>();

  for (const charge of charges) {
    // ゲームIDごとに課金額を集計
    const currentTotal = totalByGameId.get(charge.gameId) ?? 0;

    //アプリごとに合計金額を出す
    totalByGameId.set(charge.gameId, currentTotal + charge.amount);
  }

  const appTotals: AppChargeTotal[] = [];

  //Map<key, value> (const [key, value] of map)
  for (const [gameId, totalAmount] of totalByGameId) {
    const game = gameById.get(gameId);

    if (!game) {
      continue;
    }

    appTotals.push({
      gameId: game.id,
      gameName: game.name,
      gameIcon: game.icon,
      totalAmount,
    });
  }

  return appTotals
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);
}
//画面に並べるなら配列、キーで探しやすい箱を作るならMap