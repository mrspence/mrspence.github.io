// import App from 'next/app'
import { AnimateSharedLayout } from "framer-motion"
import 'tailwindcss/tailwind.css'
import 'css/themes.css'

function MyApp({ Component, pageProps }) {

    const copyHeadingLinkToClipboard = (event) => {
        if (event.target.nodeName.substr(0,1) === "H" && event.target.id){
            window.history.pushState(null, null, window.location.origin + window.location.pathname + "#" + event.target.id);
        }
    }

    return (
        <AnimateSharedLayout type="crossfade">
            <div onClick={copyHeadingLinkToClipboard}>
                <Component {...pageProps} />
            </div>
        </AnimateSharedLayout>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp

