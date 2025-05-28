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
      <title>OG Lab Menu</title>
      <meta
        name="description"
        content="OG Lab Menu"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <MenuPage rows={rows} />
  </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const rows = await fetchMenu(); // получаем данные из Google Sheets
  return {
    props: { rows },
    revalidate: 60, 
  };
};

export default Home;