import { useContext, useState } from 'react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import styles from "../styles/signinmodal.module.scss";
import UserContext from '@/contexts/UserContext';
import postFetch from '@/lib/postFetch';

const SignInModal = () => {
    const [mode, setMode] = useState(1);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { setUserInfo } = useContext(UserContext);

    function toggleMode() {
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setErrorMessage("");
        setMode(mode === 1 ? 2 : 1);
    }

    async function signIn() {
        if (!email || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Invalid email format");
            return;
        }
        
        try {
            console.log("asdfasdfasdf");
            const response = await postFetch("/socrates/api/loginEmail", { email, password });
            console.log("asdfasdfasdf");
            if (response.success) {
                setUserInfo(response.user);
            } else {
                setErrorMessage(response.message || "Sign in failed");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred. Please try again.");
        }
    }

    async function createAccount() {
        if (!username || !email || !password || !passwordConfirm) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Invalid email format");
            return;
        }

        try {
            const response = await postFetch("/socrates/api/createAccount", { username, email, password });
            if (response.success) {
                setUserInfo(response.user);
            } else {
                setErrorMessage(response.message || "Account creation failed");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred. Please try again.");
        }
    }

    return(
        <div className={styles.signinOuter}>
            <div className={styles.signinHeader}>
                <h1>{ mode === 1 ? "Sign In" : "Create Account"}</h1>
            </div>
            <p>{mode === 1 ? "No account?" : "Already have an account?"}
                <span
                    onClick={() => toggleMode()} 
                    className={styles.switchMode}>{mode === 1 ? "Sign up" : "Sign in"}</span>
            </p>

            <div className={styles.formOuter}>
                {mode === 2 && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {mode === 2 && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                )}
                <button onClick={mode === 1 ? signIn : createAccount}>
                    {mode === 1 ? "Sign In" : "Create Account"}
                </button>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>

            <div className={styles.divider}>
                <div className={styles.dividingLine}></div>
                <div className={styles.dividingLabel}>OR</div>
                <div className={styles.dividingLine}></div>
            </div>

            <div className={styles.signinButton}>
                <div className={styles.signinButtonLabel}>
                {
                    mode === 1 ? "Sign In with Google" : "Sign Up with Google"
                }
                </div>
                <GoogleSignInButton /> 
            </div>
        </div>
    )

}

export default SignInModal;