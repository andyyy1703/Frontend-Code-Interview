import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { GlobalDataProvider } from '../../context/globalContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalDataProvider>
      <Component {...pageProps} />;
    </GlobalDataProvider>
  );
}
