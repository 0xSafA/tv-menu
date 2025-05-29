// pages/menu.tsx
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import clsx from 'clsx';

import { fetchMenu, MenuRow } from '@/lib/google';
import { columnsPerCategory, groupRows } from '@/lib/menu-helpers';

/* ───────────────────────────── types ─────────────────────────── */
interface MenuProps {
  rows: MenuRow[];
}

/* ───────────── цветные индикаторы ───────────── */
const typeColor = {
  hybrid: '#4f7bff',
  hybride: '#4f7bff',
  sativa: '#ff6633',
  indica: '#38b24f',
} as const;
type KnownType = keyof typeof typeColor;
const getTypeKey = (row: MenuRow): KnownType | null => {
  const raw = row.Type?.toLowerCase();
  if (!raw) return null;
  if (raw === 'hybride') return 'hybrid';
  return (raw in typeColor ? raw : null) as KnownType | null;
};

/* ───────────── страница меню ───────────── */
const MenuPage: NextPage<MenuProps> = ({ rows }) => {
  /* порядок категорий — как в таблице */
  const categories = rows.reduce<string[]>((acc, r) => {
    const cat = r.Category ?? 'UNCATEGORISED';
    if (!acc.includes(cat)) acc.push(cat);
    return acc;
  }, []);

  const grouped = groupRows(rows); // { category: MenuRow[] }

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

      {/* СЕТКА: 1-кол. <640 px, 3-кол. >=640 px */}
      <section className='w-full max-w-[1380px] pb-6 px-4 relative'>
        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[2fr_2fr_1fr] gap-8'>
          {categories.map((cat, idx) => (
            <div key={cat} className={clsx('space-y-8', idx === 2 && 'pl-6')}>
              <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[2fr_2fr_1fr] gap-8'>
                {/* Первая колонка */}
                <div className='space-y-8'>
                  <CategoryBlock name={categories[0]} rows={grouped[categories[0]] ?? []} />
                </div>

                {/* Вторая колонка */}
                <div className='space-y-8'>
                  <CategoryBlock name={categories[1]} rows={grouped[categories[1]] ?? []} />
                </div>

                {/* Третья колонка, обёрнутая в relative-контейнер */}
                <div className='relative space-y-8 pl-6'>
                  {/* Вертикальная линия */}
                  <span className='hidden lg:block absolute left-[-12px] top-0 h-full w-[3px] bg-[var(--color-primary-light)]' />
                  <CategoryBlock name={categories[2]} rows={grouped[categories[2]] ?? []} />
                </div>
              </div>            </div>
          ))}
        </div>
        {/* вертикальная линия — только на больших экранах */}
        <span className='hidden lg:block absolute left-[calc(100%*4/5)] top-0 h-full w-[3px] bg-[var(--color-primary-light)]' />
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

/* ───────────── SSG (ISR 15 мин) ───────────── */
export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const rows = await fetchMenu();
  return { props: { rows }, revalidate: 900 };
};

/* ───────────── helpers & ui ───────────── */
function CategoryBlock({ name, rows }: { name: string; rows: MenuRow[] }) {
  const conf =
    columnsPerCategory[name] ??
    (name.toUpperCase().includes('HASH')
      ? { label: '', keys: ['Price_1g', 'Price_5g'] }
      : { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] });

  return (
    <div className='space-y-1'>
      {/* шапка секции */}
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

const headerLabel = (k: string) =>
((
  { Price_1g: '1G+', Price_5g: '5G+', Price_20g: '20G+' } as Record<
    string,
    string
  >
)[k] ?? k);

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
