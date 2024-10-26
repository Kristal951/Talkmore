import { useChatContext } from 'stream-chat-react';
import { useEffect, useState } from 'react';

const useUserStatus = (userId) => {
    const { client } = useChatContext();
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await client.queryUsers({ id: { $eq: userId } });
                if (response.users.length > 0) {
                    setIsOnline(response.users[0].online);
                }
            } catch (error) {
                console.error("Error fetching user status:", error);
            }
        };

        fetchUserStatus();

        const handleUserStatusChange = (event) => {
            if (event.user.id === userId) {
                setIsOnline(event.user.online);
            }
        };

        client.on('user.presence.changed', handleUserStatusChange);

        return () => {
            client.off('user.presence.changed', handleUserStatusChange);
        };
    }, [client, userId]);

    return isOnline;
};

export default useUserStatus;
