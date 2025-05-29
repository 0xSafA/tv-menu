// pages/menu.tsx
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import clsx from 'clsx';

import { fetchMenu, MenuRow } from '@/lib/google';
import { columnsPerCategory, groupRows, layoutOrder } from '@/lib/menu-helpers';

/* ─────────────────────────────── types ─────────────────────────── */

interface MenuProps {
  rows: MenuRow[];
}

/* ─────────────–– цветные индикаторы ───────────── */

const typeColor = {
  hybrid: '#4f7bff', // синий
  hybride: '#4f7bff', // alias
  sativa: '#ff6633', // оранж.
  indica: '#38b24f', // зелёный
} as const;

type KnownType = keyof typeof typeColor;

function getTypeKey(row: MenuRow): KnownType | null {
  const raw = (row as { Type?: string }).Type?.toLowerCase();
  if (!raw) return null;
  if (raw === 'hybride') return 'hybrid';
  return (raw in typeColor ? raw : null) as KnownType | null;
}

/* ─────────────–– страница меню ───────────── */

const MenuPage: NextPage<MenuProps> = ({ rows }) => {
  const grouped = groupRows(rows); // {category: MenuRow[]}

  return (
    <main className='min-h-screen flex flex-col items-center font-[Inter] text-[#111] bg-white'>
      {/* верхняя зелёная полоса */}
      <Line />

      {/* логотип + MENU */}
      <header className='flex items-center justify-center gap-3 text-[#536C4A] py-3'>
        <Image
          src='/logo-og-lab.svg'
          alt='OG Lab logo'
          width={64}
          height={28}
        />
        <h1 className='text-3xl font-extrabold tracking-widest'>MENU</h1>
      </header>

      {/* 3-колоночная сетка */}
      <section className='w-full max-w-[1380px] pb-6 px-4 relative'>
        <div className='grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr] gap-8'>
          {layoutOrder.map((cats, idx) => (
            <div key={idx} className={clsx('space-y-8', idx === 2 && 'pl-6')}>
              {cats.map((cat) => (
                <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
              ))}
            </div>
          ))}
        </div>

        {/* вертикальная линия */}
        <span className='absolute lg:left-2/3 top-0 h-full w-[3px] bg-[var(--color-primary-light)]' />
      </section>

      {/* легенда */}
      <footer className='w-full max-w-[1380px] text-xs flex flex-wrap items-center gap-4 pb-6 px-4'>
        <LegendDot color={typeColor.hybrid} label='Hybrid' />
        <LegendDot color={typeColor.sativa} label='Dominant Sativa' />
        <LegendDot color={typeColor.indica} label='Dominant Indica' />
        <LegendDot color='#536C4A' label='Our farm-grown' isLeaf />
        <span className='ml-auto'>Ask your budtender about a Dab Session</span>
      </footer>

      {/* нижняя полоса */}
      <Line />
    </main>
  );
};

export default MenuPage;

/* ─────────────–– SSG (ISR 15 мин) ───────────── */

export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const rows = await fetchMenu();
  return { props: { rows }, revalidate: 900 };
};

/* ─────────────–– helpers & ui ───────────── */

function CategoryBlock({ name, rows }: { name: string; rows: MenuRow[] }) {
  const conf =
    columnsPerCategory[name] ??
    (name.toUpperCase().includes('HASH')
      ? { label: '', keys: ['Price_1g', 'Price_5g'] }
      : { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] });

  return (
    <div className='space-y-1'>
      {/* зелёная плашка с колоночными подписями */}
      <div className='menu-section-title flex items-center'>
        <span className='flex-1'>{name}</span>
        {conf.label && (
          <>
            <span className='w-12 text-right'>{conf.label}</span>
            {conf.keys
              .filter((k) => k !== 'THC' && k !== 'CBG')
              .map((k) => (
                <span key={k} className='w-12 text-right'>
                  {headerLabel(k)}
                </span>
              ))}
          </>
        )}
      </div>

      {/* таблица позиций */}
      <table className='w-full text-sm'>
        <tbody>
          {rows.map((r) => {
            const typeKey = getTypeKey(r);
            return (
              <tr key={r.Name} className='align-top'>
                <td className='py-0.5 pr-2 whitespace-nowrap'>
                  {typeKey && (
                    <span
                      className='dot'
                      style={{ backgroundColor: typeColor[typeKey] }}
                    />
                  )}
                  {r.Our && (
                    <Image
                      src='/icons/leaf.svg'
                      alt=''
                      width={12}
                      height={12}
                      className='inline mr-[2px] align-middle'
                    />
                  )}
                  {r.Name}
                </td>
                {conf.keys
                  .filter((k) => k !== 'THC' && k !== 'CBG')
                  .map((k) => (
                    <td key={k} className='py-0.5 w-12 text-right'>
                      {r[k] ? `${r[k]}฿` : '-'}
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const Line = () => (
  <div className='w-full max-w-[1380px] h-[3px] bg-[var(--color-primary-light)]' />
);

function headerLabel(k: string) {
  return { Price_1g: '1G+', Price_5g: '5G+', Price_20g: '20G+' }[k] ?? k;
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
    <span className='flex items-center gap-1'>
      {isLeaf ? (
        <Image src='/icons/leaf.svg' alt='' width={12} height={12} />
      ) : (
        <span className='dot' style={{ backgroundColor: color }} />
      )}
      {label}
    </span>
  );
}
