import '../styles/globals.css'
import type { AppProps } from 'next/app'
import IndexLayout from './utils/index-layout'

function MyApp({ Component, pageProps }: AppProps) {
  return <IndexLayout>
    <Component {...pageProps} />
  </IndexLayout>
}

export default MyApp
