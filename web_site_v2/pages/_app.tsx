import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import useSWR, { SWRConfig } from 'swr'
import { appWithTranslation } from 'next-i18next'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   console.log(metric)
// }
//appWithTranslation
 function MyApp({ Component, pageProps }:any) { // AppPropsWithLayout
  const getLayout = (Component.getLayout ?? ((page) => page));
  return getLayout(
  
      <SWRConfig
        value={{
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
        }}
      >
         <Component {...pageProps} />
      </SWRConfig>
    

  )
}
export default  appWithTranslation(MyApp);