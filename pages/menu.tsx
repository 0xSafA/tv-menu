import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import clsx from 'clsx';

import { fetchMenu, MenuRow } from '../lib/google';
import { groupRows } from '../lib/menu-helpers';

interface MenuProps {
  rows: MenuRow[];
}

/* ──────────────────────────────────────────────────────────── */
/*  Раскладка блоков по колонкам                                */
/* ──────────────────────────────────────────────────────────── */
const layout: string[][] = [
  ['Top Shelf', 'Mid Shelf'], // левая
  ['Premium Quality', 'Smalls (popcorn)', 'CBD'], // центр
  ['Fresh Frosen Hash', 'Dry Sift Hash', 'Ice Bubble Hash', 'Hash Rosin'], // правая
];

/* ──────────────────────────────────────────────────────────── */
/*  Цвет кружка у позиции                                       */
/* ──────────────────────────────────────────────────────────── */
const bullet = (type: string) =>
  clsx('dot', {
    'bg-strain-indica': /indica/i.test(type),
    'bg-strain-sativa': /sativa/i.test(type),
    'bg-strain-hybrid': /hybrid/i.test(type),
  });

/* ──────────────────────────────────────────────────────────── */
/*  Компонент страницы                                          */
/* ──────────────────────────────────────────────────────────── */
const MenuPage: NextPage<MenuProps> = ({ rows }) => {
  const grouped = groupRows(rows);

  return (
    <main className='h-screen w-screen flex flex-col font-sans'>
      {/* ---------- header ---------- */}
      <header className='flex items-center justify-center gap-2 py-4'>
        <Image src='/logo-oglab.svg' alt='OG Lab logo' width={32} height={32} />
        <h1 className='text-3xl font-bold tracking-widest'>MENU</h1>
      </header>

      {/* ---------- body ---------- */}
      <section className='flex-1 grid grid-cols-3 gap-6 px-6 overflow-hidden'>
        {layout.map((col, i) => (
          <div key={i} className='space-y-6'>
            {col.map((cat) => (
              <div key={cat} className='space-y-1'>
                <h2 className='menu-section-title'>{cat}</h2>

                {/* таблица позиций */}
                <ul className='text-sm'>
                  {grouped[cat]?.map((item) => (
                    <li
                      key={item.Name}
                      className='grid grid-cols-[auto_3.25rem_3.25rem_3.25rem] gap-1 py-0.5 whitespace-nowrap'
                    >
                      <span className='flex items-center gap-1'>
                        <span className={bullet(item.Type ?? '')} />
                        {item.Our && (
                          <Image
                            src='/leaf.svg'
                            alt='Our farm-grown'
                            width={14}
                            height={14}
                            className='inline-block'
                          />
                        )}
                        {item.Name}
                      </span>
                      <span className='text-right'>{item.THC}%</span>
                      <span className='text-right'>{item.Price_5g}฿</span>
                      <span className='text-right'>{item.Price_20g}฿</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ---------- footer + legend ---------- */}
      <footer className='text-xs tracking-wide py-3 border-t border-brand-light'>
        <div className='flex flex-wrap items-center justify-center gap-6'>
          {/* легенда кружков */}
          <span className='flex items-center gap-1'>
            <span className='dot bg-strain-sativa' />
            Sativa&nbsp;Dominant
          </span>
          <span className='flex items-center gap-1'>
            <span className='dot bg-strain-indica' />
            Indica&nbsp;Dominant
          </span>
          <span className='flex items-center gap-1'>
            <span className='dot bg-strain-hybrid' />
            Hybrid
          </span>
          {/* легенда «листок» */}
          <span className='flex items-center gap-1'>
            <Image src='/leaf.svg' alt='' width={14} height={14} />
            Our&nbsp;farm-grown
          </span>
        </div>

        {/* CTA под легендой */}
        <p className='mt-2 text-center'>
          Ask your budtender about a&nbsp;Dab Session
        </p>
      </footer>
    </main>
  );
};

/* ──────────────────────────────────────────────────────────── */
/*  Извлечение данных из Google Sheets (ISR 5 мин)              */
/* ──────────────────────────────────────────────────────────── */
export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const rows = await fetchMenu();
  return {
    props: { rows },
    revalidate: 300, // 5 минут
  };
};

export default MenuPage;
