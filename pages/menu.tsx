// pages/menu.tsx
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import clsx from 'clsx';

import { fetchMenu, MenuRow } from '../lib/google';
import { columnsPerCategory, groupRows, layoutOrder } from '../lib/menu-helpers';

interface MenuProps {
  rows: MenuRow[];
}

/* ────────────────────────────── страница ───────────────────────────── */

const MenuPage: NextPage<MenuProps> = ({ rows }) => {
  const grouped = groupRows(rows);

  return (
    <main className="min-h-screen flex flex-col items-center bg-white font-[Inter] text-[#222]">
      {/* верхняя зелёная линия */}
      <div className="w-full max-w-6xl h-[3px]" style={{ backgroundColor: '#b0bf93' }} />

      {/* логотип + заголовок */}
      <header className="flex items-center justify-center gap-3 text-[#536C4A] py-2">
        <Image src="/logo-og-lab.svg" alt="OG Lab" width={72} height={32} priority />
        <h1 className="text-3xl font-semibold tracking-wide">MENU</h1>
      </header>

      {/* три колонки меню */}
      <section className="w-full max-w-6xl px-4 pb-4 relative overflow-hidden">
        <div className="grid grid-cols-3 gap-6">
          {layoutOrder.map((cats, colIdx) => (
            <div
              key={colIdx}
              className={clsx('space-y-6', colIdx === 2 && 'pl-6')}
            >
              {cats.map((cat) => (
                <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
              ))}
            </div>
          ))}
        </div>

        {/* вертикальная зелёная линия справа */}
        <span
          className="absolute left-2/3 top-0 h-full w-[3px]"
          style={{ backgroundColor: '#b0bf93' }}
        />
      </section>

      {/* легенда + нижняя плашка */}
      <footer className="w-full max-w-6xl flex flex-wrap items-center text-xs gap-2 pb-4 px-4">
        <LegendDot color="#4f7bff" label="Hybrid" />
        <LegendDot color="#ff6633" label="Dominant Sativa" />
        <LegendDot color="#38b24f" label="Dominant Indica" />
        <LegendDot color="#536C4A" label="Our farm-grown" isLeaf />

        <span className="px-2 py-1 border rounded border-[#536C4A] text-[#536C4A]">
          Minimum order 5 G
        </span>

        <span className="ml-auto">Ask your budtender about a Dab Session</span>
      </footer>

      {/* нижняя зелёная линия */}
      <div className="w-full max-w-6xl h-[3px]" style={{ backgroundColor: '#b0bf93' }} />
    </main>
  );
};

export default MenuPage;

/* ──────────────────────── SSG ────────────── */

export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const rows = await fetchMenu();          // Google Sheets → JSON
  return { props: { rows }, revalidate: 900 }; // каждые 15 мин
};

/* ─────────────────────── компоненты ─────────────────────── */

function CategoryBlock({ name, rows }: { name: string; rows: MenuRow[] }) {
  const conf =
    columnsPerCategory[name] ??
    (name.toUpperCase().includes('HASH')
      ? { label: '', keys: ['Price_1g', 'Price_5g'] }
      : { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] });

  return (
    <div className="space-y-1">
      {/* зелёная плашка-заголовок (без рамки) */}
      <div
        className="text-white font-semibold tracking-wide px-3 py-1 uppercase text-sm"
        style={{ backgroundColor: '#536C4A', border: 'none' }}
      >
        {name}
      </div>

      {/* таблица цен */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-xs uppercase text-[#536C4A]">
            {conf.label && <th className="text-left py-0.5">{conf.label}</th>}
            {conf.keys
              .filter((k) => k !== 'THC' && k !== 'CBG')
              .map((k) => (
                <th key={k} className="text-right py-0.5">
                  {headerLabel(k)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.Name} className="align-top">
              <td className="py-0.5 pr-1 whitespace-nowrap">
                {r.Tag === 'our' && (
                  <Image
                    src="/icons/leaf.svg"
                    alt="leaf"
                    width={10}
                    height={10}
                    className="inline mr-1"
                  />
                )}
                {r.Name}
              </td>

              {conf.keys
                .filter((k) => k !== 'THC' && k !== 'CBG')
                .map((k) => (
                  <td key={k} className="py-0.5 text-right">
                    {r[k] ?? '-'}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function headerLabel(key: string) {
  return (
    {
      Price_1pc: '1PC',
      Price_1g: '1G',
      Price_5g: '5G+',
      Price_20g: '20G+',
    } as Record<string, string>
  )[key] ?? key;
}

function LegendDot({
  color,
  label,
  isLeaf,
}: {
  color: string;
  label: string;
  isLeaf?: boolean;
}) {
  return (
    <span className="flex items-center gap-1 mr-2">
      {isLeaf ? (
        <Image src="/icons/leaf.svg" alt="leaf" width={10} height={10} />
      ) : (
        <span
          className="inline-block w-[10px] h-[10px] rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </span>
  );
}
