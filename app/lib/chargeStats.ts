import type { ChargeRecord } from './types';

export function getTotalAmount(records: ChargeRecord[]) {
  return records.reduce((sum, record) => sum + record.amount, 0);
}

export function getRecentCharges(records: ChargeRecord[], limit: number) {
  return [...records]
    .sort((first, second) => new Date(second.chargedAt).getTime() - new Date(first.chargedAt).getTime())
    .slice(0, limit);
}

export function getChargesByGame(records: ChargeRecord[]) {
  return records.reduce<Record<string, ChargeRecord[]>>((groups, record) => {
    const gameRecords = groups[record.gameId] ?? [];
    gameRecords.push(record);
    groups[record.gameId] = gameRecords;
    return groups;
  }, {});
}
