import { AppProps } from 'next/app';
import '../styles/globals.scss';

import  Header  from '../components/Header';
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return(
    <>  
      <Header />
      <Component {...pageProps} />
    </>
  );
}


