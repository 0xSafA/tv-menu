// pages/menu.tsx
import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import clsx from "clsx";

import { fetchMenu, MenuRow } from "../lib/google";
import { columnsPerCategory, groupRows, layoutOrder } from "../lib/menu-helpers";

/* ─────────────────────────────── types ──────────────────────────── */

interface MenuProps {
  rows: MenuRow[];
}

/* ─────────────────────–– цвет кружка по типу ───────────────────── */

const typeColor = {
  hybrid:  "#4f7bff",
  hybride: "#4f7bff",  // поддержка написания «Hybride»
  sativa:  "#ff6633",
  indica:  "#38b24f",
} as const;

type KnownType = keyof typeof typeColor;

/** Вернёт цветовой ключ или `null`, если Type не распознан */
function getTypeKey(row: MenuRow): KnownType | null {
  const raw = (row as { Type?: string }).Type?.toLowerCase();
  if (!raw) return null;                    // нет значения
  if (raw === "hybride") return "hybrid";   // нормализуем
  return (raw in typeColor ? raw : null) as KnownType | null;
}

/* ───────────────────────── страница ────────────────────────────── */

const MenuPage: NextPage<MenuProps> = ({ rows }) => {
  const grouped = groupRows(rows);

  return (
    <main className="min-h-screen flex flex-col items-center font-[Inter]">
      {/* верхняя линия */}
      <Line />

      {/* логотип + MENU */}
      <header className="flex items-center justify-center gap-3 text-[#536C4A] py-2">
        <Image src="/logo-og-lab.svg" alt="OG Lab" width={72} height={32} priority />
        <h1 className="text-3xl font-semibold tracking-wide">MENU</h1>
      </header>

      {/* три колонки */}
      <section className="w-full max-w-6xl px-4 pb-4 relative">
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "2fr 2fr 1fr" }}
        >
          {layoutOrder.map((cats, col) => (
            <div key={col} className={clsx("space-y-6", col === 2 && "pl-6")}>
              {cats.map((c) => (
                <CategoryBlock key={c} name={c} rows={grouped[c] ?? []} />
              ))}
            </div>
          ))}
        </div>

        {/* вертикальная линия */}
        <span className="absolute left-2/3 top-0 h-full w-[3px]" style={{ backgroundColor: "#b0bf93" }} />
      </section>

      {/* легенда */}
      <footer className="w-full max-w-6xl flex flex-wrap items-center text-xs gap-2 pb-4 px-4">
        <LegendDot color={typeColor.hybrid}  label="Hybrid"          />
        <LegendDot color={typeColor.sativa}  label="Dominant Sativa" />
        <LegendDot color={typeColor.indica}  label="Dominant Indica" />
        <LegendDot color="#536C4A" label="Our farm-grown" isLeaf />

        <span className="px-2 py-1 border rounded border-[#536C4A] text-[#536C4A]">
          Minimum order&nbsp;5&nbsp;G
        </span>
        <span className="ml-auto">Ask your budtender about a Dab Session</span>
      </footer>

      {/* нижняя линия */}
      <Line />
    </main>
  );
};

export default MenuPage;

/* ───────────────────────– SSG ─────────────────────── */

export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const rows = await fetchMenu();
  return { props: { rows }, revalidate: 900 };
};

/* ───────────────────── вспомогательные ───────────────────── */

function CategoryBlock({ name, rows }: { name: string; rows: MenuRow[] }) {
  const conf =
    columnsPerCategory[name] ??
    (name.toUpperCase().includes("HASH")
      ? { label: "", keys: ["Price_1g", "Price_5g"] }
      : { label: "THC", keys: ["THC", "Price_5g", "Price_20g"] });

  return (
    <div className="space-y-1">
      {/* зелёная плашка */}
      <div
        className="text-white font-semibold tracking-wide px-3 py-1 uppercase text-sm"
        style={{ backgroundColor: "#536C4A" }}
      >
        {name}
      </div>

      {/* таблица */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-xs uppercase text-[#536C4A]">
            {conf.label && <th className="text-left py-0.5">{conf.label}</th>}
            {conf.keys
              .filter((k) => k !== "THC" && k !== "CBG")
              .map((k) => (
                <th key={k} className="text-right py-0.5">
                  {headerLabel(k)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const typeKey = getTypeKey(r);
            return (
              <tr key={r.Name} className="align-top">
                {/* название + иконки */}
                <td className="py-0.5 pr-1 whitespace-nowrap">
                  {/* кружок только если тип распознан */}
                  {typeKey && (
                    <span
                      className="inline-block w-[8px] h-[8px] rounded-full mr-1 align-middle"
                      style={{ backgroundColor: typeColor[typeKey] }}
                    />
                  )}
                  {/* листик Our farm */}
                  {r.Tag === "our" && (
                    <Image
                      src="/icons/leaf.svg"
                      alt="leaf"
                      width={10}
                      height={10}
                      className="inline mr-1 align-middle"
                    />
                  )}
                  {r.Name}
                </td>

                {/* остальные колонки */}
                {conf.keys
                  .filter((k) => k !== "THC" && k !== "CBG")
                  .map((k) => (
                    <td key={k} className="py-0.5 text-right">
                      {r[k] ?? "-"}
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
  <div className="w-full max-w-6xl h-[3px]" style={{ backgroundColor: "#b0bf93" }} />
);

function headerLabel(key: string) {
  return (
    {
      Price_1pc: "1PC",
      Price_1g: "1G",
      Price_5g: "5G+",
      Price_20g: "20G+",
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
        <span className="inline-block w-[10px] h-[10px] rounded-full" style={{ backgroundColor: color }} />
      )}
      {label}
    </span>
  );
}