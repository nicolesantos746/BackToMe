export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function formatDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

export function formatCurrency(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return '-';
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Aceita "12,50", "12.50" ou "1.250,00" e devolve um número (ou NaN)
export function parseAmount(text) {
  if (typeof text === 'number') return text;
  const raw = String(text || '').trim();
  if (!raw) return NaN;
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  return Number(normalized);
}

export function isOverdue(loan) {
  if (!loan || loan.returned || !loan.dueDate) return false;
  return new Date(loan.dueDate) < startOfToday();
}
