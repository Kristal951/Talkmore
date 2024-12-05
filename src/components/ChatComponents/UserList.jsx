import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../../assets/icons/InviteIcon';
import { Spinner, Wrap, WrapItem } from '@chakra-ui/react';
import UserItem from './UserItem';

const ListContainer = ({ children }) => {
    return (
          <div className="flex w-2/5 p-2 flex-col border-[1px] gap-6 rounded-md">
                <div className="justify-between flex flex-row w-full h-full">
                <p>User</p>
                <p>Invite</p>
                </div>
                {children}
            </div>
    )
}

const UserList = ({ setSelectedUser, selectedUser }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);
            
            try {
                const response = await client.queryUsers(
                    { id: { $ne: client.userID } },
                    { id: 1 },
                    { limit: 8 } 
                );

                if(response.users.length) {
                    setUsers(response.users);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
               setError(true);
            }
            setLoading(false);
        }

        if(client) getUsers()
    }, []);

    // if(error) {
    //     return (
    //         <ListContainer>
    //             <div className="user-list__message">
    //                 Error loading, please refresh and try again.
    //             </div>
    //         </ListContainer>
    //     )
    // }

    // if(listEmpty) {
    //     return (
    //         <ListContainer>
    //             <div className="user-list__message">
    //                 No users found.
    //             </div>
    //         </ListContainer>
    //     )
    // }

    return (
        <ListContainer>
            {loading && <Spinner size="lg" />}
            {listEmpty && <p>No users found.</p>}
            {error && <div className="flex">
                Error loading users, please wait a little and reload the page.
            </div> 
            }
            {users && users.map(user => (
                <UserItem
                    key={user.id}
                    user={user}
                    // selectedUserIds={selectedUserIds}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                />
            ))}
        </ListContainer>
    )
}

export default UserList;