import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const privateKey = fs.readFileSync(
  path.resolve(process.cwd(), 'service-key.pem'),
  'utf-8'
);

const auth = new google.auth.JWT(
  process.env.GS_CLIENT_EMAIL!,
  undefined,
  privateKey,
  ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

const sheets = google.sheets({ version: 'v4', auth });

/* ───────────── типы ───────────── */
export interface MenuRow {
  Category: string | null;
  Name: string | null;
  THC?: number | null;
  CBG?: number | null;
  Price_1pc?: number | null;
  Price_1g?: number | null;
  Price_5g?: number | null;
  Price_20g?: number | null;
  Type?: string | null;
  Our?: boolean | null;
  PackmanTrail?: string | null;
}

export interface MenuLayout {
  column1: string[];
  column2: string[];
  column3: string[];
}

/* ───────────── layout + PackmanTrail ───────────── */
export async function fetchMenuWithOptions(): Promise<{
  rows: MenuRow[];
  layout: MenuLayout;
  packmanText: string;
}> {
  const rows = (await fetchRows()) ?? [];

  const layout: MenuLayout = {
    column1: [],
    column2: [],
    column3: [],
  };

  let packmanText = '';

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: 'Options!A2:C100',
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    if (data?.values) {
      data.values.forEach((row, idx) => {
        const col = String(row[0] ?? '').trim();
        const categories = String(row[1] ?? '')
          .split(',')
          .map((s) => s.trim());

        if (col === '1') layout.column1 = categories;
        if (col === '2') layout.column2 = categories;
        if (col === '3') layout.column3 = categories;

        if (idx === 0 && row[2]) packmanText = String(row[2]);
      });

      if (
        !layout.column1.length ||
        !layout.column2.length ||
        !layout.column3.length
      ) {
        console.warn(
          '⚠️ Warning: Layout columns are empty! Check Options sheet data or parsing logic.'
        );
      }
    }
  } catch (e) {
    console.warn('Options sheet fetch failed', e);
  }

  console.log('[DEBUG] rows:', Array.isArray(rows), rows?.length);
  console.log('[DEBUG] layout:', layout);
  console.log('[DEBUG] packmanText:', packmanText);

  return { rows, layout, packmanText };
}

/* ───────────── основное меню ───────────── */
async function fetchRows(): Promise<MenuRow[]> {
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GS_SHEET_ID!,
    range: 'A1:Z',
    valueRenderOption: 'UNFORMATTED_VALUE',
  });

  const values = data.values;
  if (!values || !Array.isArray(values)) return [];

  const [header, ...rows] = values as [string[], ...unknown[][]];

  return rows
    .map((r) => {
      const item: Partial<MenuRow> = {};

      header.forEach((key, i) => {
        const k = key.trim();
        const v = r[i];

        switch (k) {
          case 'Our':
            item.Our = orNull(parseBoolean(v));
            break;
          case 'THC':
          case 'CBG':
          case 'Price_1pc':
          case 'Price_1g':
          case 'Price_5g':
          case 'Price_20g':
            item[k as keyof MenuRow] = orNull(parseNumber(v)) as never;
            break;
          case 'Category':
          case 'Name':
          case 'Type':
          case 'PackmanTrail':
            item[k as keyof MenuRow] = String(v ?? '').trim() as never;
            break;
        }
      });

      return item as MenuRow;
    })
    .filter((row) => row.Name && row.Category);
}

/* ───────────── утилиты ───────────── */
function orNull<T>(v: T | undefined): T | null {
  return v === undefined ? null : v;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'string') {
    const v = value.trim().toUpperCase();
    if (v === 'TRUE') return true;
    if (v === 'FALSE') return false;
  }
  if (typeof value === 'boolean') return value;
  return undefined;
}

function parseNumber(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return isNaN(n) ? undefined : n;
}