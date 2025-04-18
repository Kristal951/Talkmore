import { Avatar } from '@chakra-ui/react';
import { useCall } from '@stream-io/video-react-sdk';
import React from 'react'

const IncomingCallUI = ({AcceptCall, DeclineCall}) => {
    const call = useCall();

    const createdBy = call.state.createdBy.name
    const createdByImage = call.state.createdBy.image
    
  return (
    <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-max">
            <div className="flex-col flex items-center justify-center">
                <Avatar
                    src={createdByImage}
                    name={createdBy}
                    size="xl"
                >

                </Avatar>
                <p className="text-lg mb-4 inline">Incoming call from <p className='font-semibold text-lg inline'>{createdBy}</p></p>
            </div>

            <div className="flex-row flex items-center justify-center gap-4">
                <button 
                    onClick={AcceptCall} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                Accept
                </button>
                <button 
                    onClick={DeclineCall} 
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    Decline
                </button> 
            </div>
        </div>
    </div>
  )
}

export default IncomingCallUI