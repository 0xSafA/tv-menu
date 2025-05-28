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

/** Строка из таблицы OG Lab Menu */
export interface MenuRow {
  Category: string;
  Name: string;
  THC?: number;
  CBG?: number;
  Price_1pc?: number;
  Price_1g?: number;
  Price_5g?: number;
  Price_20g?: number;
  Type?: string;
  Our?: boolean;
}

/** Преобразует значение TRUE/FALSE в boolean */
function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'string') {
    const v = value.trim().toUpperCase();
    if (v === 'TRUE') return true;
    if (v === 'FALSE') return false;
  }
  if (typeof value === 'boolean') return value;
  return undefined;
}

/** Преобразует значение в число (если возможно) */
function parseNumber(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return isNaN(n) ? undefined : n;
}

export async function fetchMenu(): Promise<MenuRow[]> {
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
        const rawKey = key.trim();
        const value = r[i];

        switch (rawKey) {
          case 'Our':
            item.Our = parseBoolean(value);
            break;
          case 'THC':
          case 'CBG':
          case 'Price_1pc':
          case 'Price_1g':
          case 'Price_5g':
          case 'Price_20g':
            item[rawKey as keyof MenuRow] = parseNumber(value) as never;
            break;
          case 'Category':
          case 'Name':
          case 'Type':
            item[rawKey as keyof MenuRow] = String(value ?? '').trim() as never;
            break;
        }
      });

      return item as MenuRow;
    })
    .filter((row) => row.Name && row.Category);
}
