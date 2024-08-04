import NavBar from "@/components/NavBar";
import styles from "../../styles/signin.module.scss";

import UserContext from "../../contexts/UserContext";
import { useContext } from "react";
import SignInModal from "@/components/SignInModal";
import UserInfo from "@/components/UserInfo";
import Head from "next/head";

const SignIn = () => {

    const {userInfo, setUserInfo} = useContext(UserContext);

    return (
        <div className={styles.mainContent}>
            <Head>
                <title>socrates - { userInfo?.id ? "account" : "sign in"}</title>
            </Head>
            <NavBar />
            <div className={styles.contentBackground}></div>
            <div className={styles.signInContainer}>

                {
                    userInfo?.id ?
                    <UserInfo/> : <SignInModal />
                }
            </div>
        </div>
    )
}

export default SignIn;