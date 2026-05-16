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

