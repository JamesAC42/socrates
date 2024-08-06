import styles from "../../styles/pricing.module.scss";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import postFetch from "@/lib/postFetch";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { useRouter } from 'next/router';

const Pricing = () => {

    const {userInfo} = useContext(UserContext);
    const router = useRouter();

    async function buyPremium() {    
        
        if(!userInfo) {
            router.push('/signin');
            return;
        }

        if(userInfo.tier === 2) {
            return;
        }

        let response = await postFetch("/socrates/api/createCheckoutSession", {});
        if(response.success) {
            window.location.href = response.url; 
        }
    }

    return (
        <div className={styles.mainContent}>
            <Head>
                <title>socrates - pricing</title>
            </Head>
            <NavBar />
            <div className={styles.contentBackground}></div>
            <div className={styles.pricingOuter}>

                <h1>pricing</h1>
                <p>buy a premium account to get <strong>unlimited evaluations</strong>, <strong>increased conversation length to 60 messages</strong>, and all upcoming features including:</p>
                <ul>
                    <li>topic expert leaderboard</li>
                    <li>saved conversations</li>
                    <li>knowledge graphs</li>
                </ul>

                <div className={styles.pricingInfo}>
                    <div className={styles.pricingHeader}>
                        <h3>socrates - premium</h3>
                    </div>
                    <div className={styles.pricingSubheader}>
                        only <strong>$20</strong>/ 3 months
                    </div>
                    <div 
                        onClick={buyPremium}
                        className={styles.buyButton}>{ userInfo?.tier === 2 ? "Already subscribed!" : "Subscribe Now"}</div>
                </div>

            </div>
        </div>
    )
}

export default Pricing;