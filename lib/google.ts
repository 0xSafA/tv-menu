// shop/lib/google.ts
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

/** Преобразует строковое значение из таблицы в число */
function parseNumber(value: any): number | undefined {
  const n = parseFloat(value);
  return isNaN(n) ? undefined : n;
}

/** Преобразует строку TRUE/FALSE в boolean */
function parseBoolean(value: any): boolean | undefined {
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

  const [header, ...rows] = data.values as any[][];

  return rows
    .map((r) =>
      header.reduce<MenuRow>((acc, key, i) => {
        const value = r[i];

        switch (key) {
          case 'THC':
          case 'CBG':
          case 'Price_1pc':
          case 'Price_1g':
          case 'Price_5g':
          case 'Price_20g':
            acc[key as keyof MenuRow] = parseNumber(value);
            break;
          case 'Our':
            acc.Our = parseBoolean(value);
            break;
          default:
            acc[key as keyof MenuRow] = value;
        }

        return acc;
      }, {} as MenuRow)
    )
    .filter((item) => item.Name && item.Category); // отфильтровываем пустые строки
}
