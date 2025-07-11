import type { GetStaticProps, NextPage } from 'next';
import type { MenuRow } from '@/lib/google';
import Image from 'next/image';
import { columnsPerCategory, groupRows } from '@/lib/menu-helpers';
import { fetchMenuWithOptions } from '@/lib/google';
import PulseController from '@/components/PulseController';
import PacmanTrail from '@/components/PacmanTrail';

interface MenuProps {
  rows: MenuRow[];
  layout: {
    column1: string[];
    column2: string[];
    column3: string[];
  };
  packmanText?: string;
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
  return (Object.keys(typeColor) as KnownType[]).includes(raw as KnownType) ? (raw as KnownType) : null;
};

const MenuPage: NextPage<MenuProps> = ({ rows, layout }) => {
  if (!Array.isArray(rows)) {
    console.error('❌ MenuPage: `rows` is not an array', rows);
    return <div className="p-4 text-red-600">Error loading menu</div>;
  }

  const grouped = groupRows(rows);

  return (
    <main className="relative max-w-[1570px] overflow-hidden mx-auto px-4 z-10">
      <PulseController />

      {/* Шапка */}
      <header className="flex items-center justify-center gap-3 mb-6">
        <Image src="/logo-og-lab.svg" alt="Logo" width={80} height={80} />
        <h1 className="text-3xl font-bold tracking-wide uppercase">Menu</h1>
      </header>

      {/* Меню */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
          {/* 1 колонка */}
          <div className="space-y-8">
            {layout.column1.map((cat) => (
              <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
            ))}
          </div>

          {/* 2 колонка */}
          <div className="space-y-8">
            {layout.column2.map((cat) => (
              <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
            ))}
          </div>

          {/* 3 колонка */}
          <div className="relative pl-6">
            <span className="hidden lg:block absolute left-[-12px] top-0 h-full w-[3px] bg-[var(--color-primary-light)] z-0" />
            <div className="space-y-8">
              {layout.column3.map((cat) => (
                <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Горизонтальная линия */}
      <div className="mt-6">
        <Line />
      </div>

      {/* Легенда */}
      <footer className="mt-4 w-full max-w-[1570px] text-lg flex flex-wrap items-center gap-4 pb-6 px-4 relative z-10">
        <LegendDot color={typeColor.hybrid} label="Hybrid" dataColor="hybrid" />
        <LegendDot color={typeColor.sativa} label="Dominant Sativa" dataColor="sativa" />
        <LegendDot color={typeColor.indica} label="Dominant Indica" dataColor="indica" />
        <LegendDot color="#536C4A" label="Our farm-grown" isLeaf />
        <span className="ml-auto text-lg">Weed (with batches from 5g)</span>
        <span className="ml-auto text-lg">Ask your budtender about a Dab Session</span>
      </footer>

      {/* Анимация Пакмана */}
      <div className="absolute inset-0 pointer-events-none">
  <PacmanTrail />
</div>
    </main>
  );
};

export default MenuPage;

export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const { rows, layout, packmanText } = await fetchMenuWithOptions();
  return { props: { rows, layout, packmanText }, revalidate: 900 };
};

/* ───────────── helpers & UI ───────────── */

function CategoryBlock({ name, rows }: { name: string; rows: MenuRow[] }) {
  const conf =
    columnsPerCategory[name] ??
    (name.toUpperCase().includes('HASH')
      ? { label: '', keys: ['Price_1g', 'Price_5g'] }
      : { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] });

  const showTHC = rows.some((r) => r.THC);
  const priceKeys = conf.keys.filter((k) => k !== 'THC' && k !== 'CBG');

//</div><div className="menu-section-title flex items-center bg-[#536C4A] text-white font-bold px-2 py-1 rounded-sm uppercase tracking-wide">    
  return (
    <div className="space-y-1">
      <div className="menu-section-title flex items-center bg-[#536C4A] text-white font-bold px-2 py-1 rounded-sm uppercase tracking-wide outline-none border-none focus:outline-none focus:ring-0">
        <span className="flex-1">{name}</span>
        {showTHC && <span className="w-16 text-right">THC</span>}
        {priceKeys.map((k) => (
          <span key={k} className="w-16 text-right">
            {headerLabel(k)}
          </span>
        ))}
      </div>

      <table className="w-full text-base table-fixed">
        <tbody>
          {rows.map((r) => {
            const typeKey = getTypeKey(r);
            return (
              <tr key={r.Name} className="align-top hover:bg-[#f9f9f9] transition-colors">
                <td className="py-0.5 pr-2 break-words max-w-[260px] align-top">
                  {typeKey && (
                    <span
                      className="dot animate-breath"
                      data-color={typeKey}
                      style={{ backgroundColor: typeColor[typeKey] }}
                    />
                  )}
                  {r.Our && (
                    <Image
                      src="/leaf.svg"
                      alt="Our farm-grown leaf icon"
                      width={12}
                      height={12}
                      className="leaf inline mr-[2px] align-middle animate-breathLeaf"
                      data-color="leaf"
                    />
                  )}
                  {r.Name}
                </td>
                {showTHC && (
                  <td className="py-0.5 w-16 text-right">
                    {r.THC ? `${r.THC}%` : r.CBG ? `${r.CBG}%` : '-'}
                  </td>
                )}
                {priceKeys.map((k) => (
                  <td key={k} className="py-0.5 w-16 text-right">
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
  <div className="w-full max-w-[1570px] h-[3px] bg-[var(--color-primary-light)]" />
);

const headerLabel = (k: string) =>
  ({
    Price_1pc: '1PC',
    Price_1g: '1G+',
    Price_5g: '5G+',
    Price_20g: '20G+',
  }[k] ?? k);

function LegendDot({
  color,
  label,
  isLeaf,
  dataColor,
}: {
  color: string;
  label: string;
  isLeaf?: boolean;
  dataColor?: string;
}) {
  return (
    <span className="flex items-center gap-1">
      {isLeaf ? (
        <Image
          src="/leaf.svg"
          alt="Leaf icon"
          width={12}
          height={12}
          className="leaf animate-breathLeaf"
          data-color="leaf"
        />
      ) : (
        <span
          className="dot animate-breath"
          data-color={dataColor}
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </span>
  );
}