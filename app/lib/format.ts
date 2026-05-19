//金額を日本円表記にフォーマットする関数
export function formatCurrency(value: number) {
  return `¥${value.toLocaleString()}`;
}

//現在の年月日を "YYYY-MM-DD" 形式で返す
export function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

export function parseChargeDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

// Dateオブジェクトを受け取り、"YYYY年M月" 形式の文字列を返す
export function formatChargeMonthLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

//Dateオブジェクトを受け取り、"YYYY年M月D日" 形式の文字列を返す
export function formatChargeDateLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// Dateオブジェクトを受け取り、曜日を表す文字列を返す "月", "火", "水" など
export function formatWeekdayLabel(date: Date) {
  return weekdays[date.getDay()];
}

export function formatMonthInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

//指定した月に移動する関数
export function addMonths(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(date.getMonth() + amount);

  return next;
}
