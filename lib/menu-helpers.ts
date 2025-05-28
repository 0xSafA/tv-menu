import { MenuRow } from './google';

/**
 * Определяет, какие столбцы показывать для каждой категории.
 */
export const columnsPerCategory: Record<
  string,
  { label: string; keys: (keyof MenuRow)[] }
> = {
  'TOP SHELF': { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] },
  'MID SHELF': { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] },
  'PREMIUM': { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] },
  'SMALLS': { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] },
  'CBG': { label: 'CBG', keys: ['CBG', 'Price_5g', 'Price_20g'] },
  'PRE ROLLS': { label: '', keys: ['Price_1pc'] },
  'PIATELLA': { label: '', keys: ['Price_1g', 'Price_5g'] },
  'FRESH FROZEN HASH': { label: '', keys: ['Price_1g', 'Price_5g'] },
  'LIVE HASH ROSIN': { label: '', keys: ['Price_1g', 'Price_5g'] },
  'DRY SIFT HASH': { label: '', keys: ['Price_1g', 'Price_5g'] },
  'ICE BUBBLE HASH': { label: '', keys: ['Price_1g', 'Price_5g'] },
};

/**
 * Определяет раскладку категорий по колонкам для отображения.
 */
export const layoutOrder: string[][] = [
  ['TOP SHELF', 'MID SHELF'],
  ['PREMIUM', 'SMALLS', 'CBG', 'PRE ROLLS', 'PIATELLA'],
  ['FRESH FROZEN HASH', 'LIVE HASH ROSIN', 'DRY SIFT HASH', 'ICE BUBBLE HASH'],
];

/**
 * Группирует строки меню по категории. Ожидает, что Category написан заглавными.
 */
export function groupRows(rows: MenuRow[]) {
  const byCat: Record<string, MenuRow[]> = {};
  for (const r of rows) {
    const key = r.Category?.trim() || 'UNSORTED';
    if (!byCat[key]) byCat[key] = [];
    byCat[key].push(r);
  }
  return byCat;
}
