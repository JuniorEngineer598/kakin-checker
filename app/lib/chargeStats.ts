import type { ChargeRecord } from './types';

export function getTotalAmount(records: ChargeRecord[]) {
  return records.reduce((sum, record) => sum + record.amount, 0);
}

export function getRecentCharges(records: ChargeRecord[], limit: number) {
  return [...records]
    .sort((first, second) => new Date(second.chargedAt).getTime() - new Date(first.chargedAt).getTime())
    .slice(0, limit);
}

export function getChargesByApp(records: ChargeRecord[]) {
  return records.reduce<Record<string, ChargeRecord[]>>((groups, record) => {
    const appRecords = groups[record.appId] ?? [];
    appRecords.push(record);
    groups[record.appId] = appRecords;
    return groups;
  }, {});
}
