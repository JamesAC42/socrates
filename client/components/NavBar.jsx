import styles from "../styles/navbar.module.scss";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import UserContext from "@/contexts/UserContext";

const NavBar = () => {

    const router = useRouter();
    const [active, setActive] = useState(null);
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        const path = router.pathname;
        if (path === '/') setActive(1);
        else if (path === '/chat') setActive(0);
        else if (path === '/signin') setActive(2);
        else if (path === '/pricing') setActive(3);
    }, [router.pathname]);

    const handleClick = (index, path) => {
        setActive(index);
        router.push(path);
    };

    const navItem = (link, id, label) => {
        return (
        <Link href={link}>
            <div 
                className={`${styles.navbarItem} ${active === id ? styles.active : ''}`}
                onClick={() => handleClick(id, link)}>
                {label}
            </div>
        </Link>
        )
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.navbarInner}>
                {navItem("/chat", 0, "chat")}
                {navItem("/", 1, "about")}
                {navItem("/pricing", 3, "pricing")}
                {navItem("/signin", 2, userInfo?.id ? "account" : "sign in")}
            </div>
        </div>
    )

}

export default NavBar;