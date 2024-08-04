import GoogleSignInButton from '../components/GoogleSignInButton';
import styles from "../styles/signinmodal.module.scss";

const SignInModal = () => {


    return(
        <div className={styles.signinOuter}>
            <div className={styles.signinHeader}><h1>Sign In or Create Account</h1></div>
            <p>Sign in with your Google account to access the chat!</p>
            <div className={styles.signinButton}>
                <GoogleSignInButton /> 
            </div>
        </div>
    )


}

export default SignInModal;