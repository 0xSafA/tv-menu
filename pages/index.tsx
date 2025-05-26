import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import MenuPage from "./menu";
import { fetchMenu, MenuRow } from "../lib/google"; // ← те же функции/типы, что и в menu.tsx

type HomeProps = {
  rows: MenuRow[];
};

const Home: NextPage<HomeProps> = ({ rows }) => (
  <>
    <Head>
      <title>OG Lab | TV Menu</title>
      <meta
        name="description"
        content="Актуальное телевизионное меню OG Lab: свежие сорта, цены и предложения"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    {/* Используем тот же компонент, что и на /menu */}
    <MenuPage rows={rows} />
  </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const rows = await fetchMenu(); // получаем данные из Google Sheets
  return {
    props: { rows },
    revalidate: 900, // пересобирать каждые 15 минут
  };
};

export default Home;