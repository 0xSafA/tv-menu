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
  THC?: string;
  CBG?: string;
  Price_1pc?: string;
  Price_1g?: string;
  Price_5g?: string;
  Price_20g?: string;
  Type?: string;
  Our?: boolean;
}

/** Преобразует строку TRUE/FALSE в boolean */
function parseBoolean(value: unknown): boolean | undefined {
  if (value === 'TRUE' || value === true) return true;
  if (value === 'FALSE' || value === false) return false;
  return undefined;
}

export async function fetchMenu(): Promise<MenuRow[]> {
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GS_SHEET_ID!,
    range: 'A1:Z',
    valueRenderOption: 'UNFORMATTED_VALUE',
  });

  const values = data.values;
  if (!values || !Array.isArray(values)) return [];

  const [header, ...rows] = values as [string[], ...string[][]];

  return rows
    .map((r) => {
      const item: Partial<MenuRow> = {};

      header.forEach((key, i) => {
        const k = key as keyof MenuRow;
        const value = r[i];

        if (k === 'Our') {
          item.Our = parseBoolean(value);
        } else {
          item[k] = value as never; // TypeScript hack: we know value is compatible
        }
      });

      return item as MenuRow;
    })
    .filter((row) => row.Name && row.Category);
}
