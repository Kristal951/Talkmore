import { Wrap, WrapItem, Avatar, AvatarBadge } from '@chakra-ui/react'
import React, { useState } from 'react'
import { InviteIcon } from '../assets/icons/InviteIcon'

const UserItem = ({ user, selectedUser, setSelectedUser }) => {
    const [selected, setSelected] = useState(false)

    const handleSelect = () => {
        if(selected) {
            setSelectedUser((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))    
        } else {
            setSelectedUser((prevUsers) => [...prevUsers, user.id])    
        }
        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className='flex items-center justify-between' onClick={handleSelect}>
            <Wrap className='flex flex-row'>
                <WrapItem>
                    <div className="gap-2 flex flex-row h-max w-max justify-center items-center">
                        <Avatar 
                              src={user?.image} 
                              name={user?.name} 
                              className="w-10 h-10 ml-2 rounded-full"
                            >
                                {
                                    user?.online === "true" &&(
                                        <AvatarBadge boxSize='1.10em' bg='green.500' />
                                    )
                                }
                            </Avatar>
                        <p className='font-bold text-xl'>{user.name}</p>
                    </div>
                </WrapItem>
            </Wrap>
            {selected ? <InviteIcon /> : <div className='w-[50px] h-[50px] cursor-pointer rounded-full border-[1px]'></div>}
        </div>
    );
};

export default UserItem;
