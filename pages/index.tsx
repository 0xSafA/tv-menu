import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { fetchMenuWithOptions, MenuRow, MenuLayout } from "../lib/google";

// Импортируем MenuPage динамически, если хочешь оптимизацию
const MenuPage = dynamic(() => import("./menu"));

type HomeProps = {
  rows: MenuRow[];
  layout: MenuLayout;
  packmanText?: string;
};

const Home: NextPage<HomeProps> = ({ rows, layout, packmanText }) => {
  return (
    <>
      <Head>
        <title>OG Lab Menu</title>
        <meta name="description" content="OG Lab Menu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuPage rows={rows} layout={layout} packmanText={packmanText} />
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const { rows, layout, packmanText } = await fetchMenuWithOptions();
    return {
      props: { rows, layout, packmanText },
      revalidate: 60, // обновлять данные с таблицы каждые 60 секунд
    };
  } catch (err) {
    console.error("❌ getStaticProps error in index.tsx", err);
    return {
      props: {
        rows: [],
        layout: { column1: [], column2: [], column3: [] },
        packmanText: '',
      },
    };
  }
};

export default Home;