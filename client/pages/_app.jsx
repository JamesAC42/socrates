import '../styles/global.scss';
import Script from 'next/script';
import UserContext from '../contexts/UserContext';
import {useState} from 'react';
import UserSession from '@/components/UserSession';
import Head from 'next/head';

export default function App({ Component, pageProps }) {

    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            <Head>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <UserSession />
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
            />
            <Script defer src="https://umami.ovel.sh/script.js" data-website-id="2eb75c0a-ec24-46cd-bc88-b87400095b83"></Script>
            <Component {...pageProps} />
        </UserContext.Provider>
    );
}