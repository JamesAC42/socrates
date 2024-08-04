import NavBar from "@/components/NavBar";
import styles from "../styles/about.module.scss";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";

const About = () => {

    
    return (
        <div className={styles.mainContent}>
            <Head>
                <title>socrates - about</title>
            </Head>
            <NavBar />
            <div className={styles.contentBackground}></div>
            <div className={styles.about}>
                <h1>socrates</h1>
                <h2>know what you don't know</h2>
                <h4>what is socrates?</h4>
                <p>socrates is a tool to test how comprehensive your understanding is on any topic, from history and science to popular culture or niche interests</p>
                <h4>how does it work?</h4>
                <p>tell socrates the subject you'd like to be evaluated on, and it will begin asking a series of questions that you should answer as thoroughly as possible. When you're finished, you will receive an in depth evaluation on your knowledge level and a breakdown of what you need to brush up on.</p>
                <div className={styles.buttons}>
                    <Link href="/signin">
                        <div className={styles.getStarted}>Get started for free <FaArrowAltCircleRight/></div>
                    </Link>
                </div>
                <h4>Coming Soon</h4>
                <ul>
                    <li>Topic leaderboards</li>
                    <li>Knowledge graphs</li>
                    <li>Longer conversation limit</li>
                    <li>Save conversations and analysis</li>
                </ul>
                <hr></hr>
                <h4>Contact</h4>
                <p>For questions, comments, feedback, suggestions, etc. contact <a href="mailto:fukuin.socrates@gmail.com">fukuin.socrates@gmail.com</a></p>
                <div className={styles.footer}>
                    <div className={styles.footerLinks}>
                        <span>© 2024 socrates</span>
                        <span className={styles.separator}>|</span>
                        <Link href="/privacyPolicy">Privacy Policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="https://github.com/JamesAC42/socrates">Github</Link>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default About;