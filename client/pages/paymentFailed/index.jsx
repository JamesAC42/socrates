import styles from "../../styles/paymentresult.module.scss";
import Head from "next/head";
import NavBar from "@/components/NavBar";

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PaymentFailed = () => {

    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/signin');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.mainContent}>
            <Head>
                <title>socrates - payment failed</title>
            </Head>
            <NavBar />
            <div className={styles.contentBackground}></div>
            <div className={styles.paymentResult}>

                <h2>Payment failed to process, redirecting...</h2>

            </div>
        </div>
    )
}

export default PaymentFailed;