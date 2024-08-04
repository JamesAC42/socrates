import { useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import postFetch from '@/lib/postFetch';

const UserSession = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        let isMounted = true;

        const fetchSession = async () => {
            if (userInfo) return;

            try {
                const response = await postFetch("/api/getSession", {});
                if (response.success && isMounted) {
                    setUserInfo(response.user);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSession();

        return () => {
            isMounted = false;
        };
    }, [userInfo, setUserInfo]);

    return null;
}

export default UserSession;