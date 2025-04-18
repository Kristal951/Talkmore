import { useChatContext } from 'stream-chat-react';
import { useEffect, useState } from 'react';

const useUserStatus = (userId) => {
    const { client } = useChatContext();
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Check the user's initial online status
        const fetchUserStatus = async () => {
            try {
                const response = await client.queryUsers({ id: { $eq: userId } });
                if (response.users.length > 0) {
                    setIsOnline(response.users[0].online);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserStatus();

        // Event listener for changes in user presence
        const handleUserStatusChange = (event) => {
            if (event.user.id === userId) {
                setIsOnline(event.user.online);
            }
        };

        client.on('user.presence.changed', handleUserStatusChange);

        // Clean up the event listener on component unmount
        return () => {
            client.off('user.presence.changed', handleUserStatusChange);
        };
    }, [client, userId]);

    return isOnline;
};

export default useUserStatus;
