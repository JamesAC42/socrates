import NavBar from "@/components/NavBar";
import styles from "../../styles/privacypolicy.module.scss";
import Head from "next/head";

const PrivacyPolicy = () => {

    return (
        <div className={styles.mainContent}>
            <Head>
                <title>socrates - privacy policy</title>
            </Head>
            <NavBar />
            <div className={styles.contentBackground}></div>

            <div className={styles.scrollOuter}>
                <div className={styles.privacyPolicy}>
                    <h1>Privacy Policy for Socrates</h1>

                    <p><em>Last updated: 9/4/2024</em></p>

                    <h2>1. Introduction</h2>
                    <p>Welcome to Socrates ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application.</p>

                    <h2>2. Information We Collect</h2>
                    <h3>2.1 Personal Information</h3>
                    <p>We collect the following personal information when you create an account:</p>
                    <ul>
                        <li>Name</li>
                        <li>Email address</li>
                    </ul>
                    <p>This information is obtained through your Google account when you log in.</p>

                    <h3>2.2 Non-Personal Information</h3>
                    <p>We use cookies to keep you logged into your account. These cookies are associated with a session that stores your email and name.</p>

                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Identify and manage your user account</li>
                        <li>Provide and maintain our services</li>
                        <li>Occasionally send emails to notify you about updates to our service</li>
                    </ul>
                    <p>We do not sell your personal information or use it for any purpose other than those stated above.</p>

                    <h2>4. Information Sharing and Disclosure</h2>
                    <p>We do not share or disclose your personal information with any third parties.</p>

                    <h2>5. Data Retention</h2>
                    <p>We do not have a specific data retention policy. Your information may be stored for an indefinite period or may be deleted at any time.</p>

                    <h2>6. Cookies</h2>
                    <p>We use cookies to keep you logged into your account. You can control cookies through your browser settings.</p>

                    <h2>7. Children's Privacy</h2>
                    <p>Our service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.</p>

                    <h2>8. Changes to This Privacy Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

                    <h2>9. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <p>Email: jamescrovo450@gmail.com</p>
                </div>
            </div>
        </div>
    )

}

export default PrivacyPolicy;