import Head from "next/head";
import styles from "../../styles/paymentresult.module.scss";
import NavBar from "@/components/NavBar";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PaymentSuccess = () => {

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
                <title>socrates - payment success</title>
            </Head>
            <NavBar />
            <div className={styles.contentBackground}></div>
            <div className={styles.paymentResult}>

                <h2>Payment processed successfully, redirecting...</h2>

            </div>
        </div>
    )
}

export default PaymentSuccess;