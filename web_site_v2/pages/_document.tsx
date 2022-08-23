import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
    return (
        <Html>
            <Head>
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                {/* <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="-1" />  lang={currentLocale}*/}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
