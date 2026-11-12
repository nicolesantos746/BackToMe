export const LOAN_TYPES = [
  { key: 'livro', label: 'Livro', icon: 'book-outline' },
  { key: 'ferramenta', label: 'Ferramenta', icon: 'hammer-outline' },
  { key: 'dinheiro', label: 'Dinheiro', icon: 'cash-outline' },
  { key: 'outro', label: 'Outro', icon: 'cube-outline' },
];

export function getLoanType(key) {
  return LOAN_TYPES.find((type) => type.key === key) || LOAN_TYPES[LOAN_TYPES.length - 1];
}
