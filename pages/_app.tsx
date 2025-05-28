import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Bebas_Neue, Montserrat, Inter } from 'next/font/google';

// Импорт шрифтов и объявление CSS-переменных
export const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
});
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-montserrat',
});
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${bebas.variable} ${montserrat.variable} ${inter.variable} font-sans`}
    >
      <Component {...pageProps} />
    </main>
  );
}
