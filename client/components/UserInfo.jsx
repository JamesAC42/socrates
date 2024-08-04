import postFetch from "@/lib/postFetch";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";
import { IoPersonCircle } from "react-icons/io5";
import styles from "../styles/userinfo.module.scss"; 

const UserInfo = () => {

    const {userInfo, setUserInfo} = useContext(UserContext);

    const logout = async () => { 
        const response = await postFetch("/api/logout");
        if(response.success) {
            setUserInfo(null);
        } else {
            console.error(response.message);
        }
    }

    function tier(t) {
        switch(t) {
            case 1: 
                return "Basic";
            case 2:
                return "Premium";
            default:
                return "";
        }
    }

    if(!userInfo) return null;

    return(
        <div className={styles.userInfoContainer}>
            
            <div className={styles.profileImage}>
                <IoPersonCircle />
            </div>
            
            <div className={styles.infoContainer}>
                <div className={styles.profileInfo}>
                    <div className={styles.label}>Email:</div>
                    <div className={styles.info}>{userInfo.email}</div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.label}>Name:</div>
                    <div className={styles.info}>{userInfo.name}</div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.label}>User Since:</div>
                    <div className={styles.info}>{new Date(userInfo.date_created).toLocaleDateString()}</div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.label}>Tier:</div>
                    <div className={styles.info}>{tier(userInfo.tier)}</div>
                </div>
            </div>

            <div className={styles.logout}>
                <div
                    onClick={logout} 
                    className={styles.logoutButton}>Log Out</div>
            </div>
        </div>
    )

}
export default UserInfo;