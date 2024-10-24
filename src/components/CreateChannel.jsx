import React, { useState, useCallback } from 'react';
import { Button, Input, InputGroup, InputLeftAddon, useToast } from '@chakra-ui/react';
import UserList from './UserList';
import { useChatContext } from 'stream-chat-react';
import { useDropzone } from 'react-dropzone';
import { MdFileUpload } from "react-icons/md";
import { getFileUrl, uploadFile } from '../lib/AppriteFunction';

const CreateChannel = ({ createType, setIsCreating }) => {
    const { client, setActiveChannel } = useChatContext(); // Destructure setActiveChannel from useChatContext
    const [channelName, setChannelName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
    const [channelImage, setChannelImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const toast = useToast();

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setChannelImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'image/*': ['.png', '.svg', '.jpeg', '.jpg']
        }
    });

    const createChannel = async () => {

        if (createType === 'team' && !channelName) {
            return toast({
                        title: 'Input Channel Name',
                        description: 'Please make sure to enter aname for your channel.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right',
                    });
        }

        if (selectedUsers.length < 2) {
            return toast({
                        title: 'Select at least more than one User',
                        description: 'Please select at least one more user to create a channel',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right',
                    });;
        }

        try {
            let fileUrl = '';

            if (channelImage) {
                const uploadedFile = await uploadFile(channelImage);
                fileUrl = await getFileUrl(uploadedFile.$id);
            }

            const newChannel = client.channel(
                createType, {
                    name: channelName || 'Untitled Channel',
                    members: selectedUsers,
                    image: fileUrl || ''
                }
            );

            await newChannel.create(); // Ensure the channel is created

            // Set the newly created channel as the active channel
            setActiveChannel(newChannel);

            // Reset state and exit creation
            setChannelName('');
            setSelectedUsers([client.userID || '']);
            setChannelImage(null);
            setImagePreview(null);
            setIsCreating(false);

            return toast({
                title: 'Channel Created',
                description: 'Your channel has been created succesfully, happy chatting!!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });

        } catch (error) {
            console.error('Error creating channel:', error);
            return toast({
                title: 'Something Went Wrong',
                description: 'Failed to create the channel. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <div className='w-full h-screen relative'>
            <div className="flex w-full h-[60px] items-center justify-start p-2 shadow-md z-50">
                <p className='capitalize font-bold text-xl text-blue-600'>
                    {createType === 'team' ? 'Create a new channel' : 'Send a direct message'}
                </p>
            </div>
            <div className='mt-10 ml-4'>
                {createType === 'team' && (
                    <div className="flex flex-col gap-8">
                        <InputGroup>
                            <InputLeftAddon>Name</InputLeftAddon>
                            <Input
                                variant='outline'
                                placeholder='Channel Name'
                                width="60%"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                            />
                        </InputGroup>

                        <div className="flex p-2">
                            <p className='font-bold text-xl'>Add members</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-row gap-28">
                    <UserList setSelectedUser={setSelectedUsers} selectedUser={selectedUsers} />

                    {
                        createType === 'team' && (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className='w-[400px] h-[340px] rounded-md flex items-center flex-col justify-center border-[1px]'>
                                    <div className="flex p-4 pb-6">
                                        <p className='font-bold text-xl'>Channel Image</p>
                                    </div>

                                    <div className="flex w-3/5 p-2 border-[2px] flex-col border-dashed rounded-lg h-3/5">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <MdFileUpload className='w-full h-full' />
                                        )}
                                        {!imagePreview && <p>Drag and drop an image into the box, or click below to select one</p>}
                                    </div>
                                    <div className="flex p-4">
                                        <Button colorScheme='blue' width="100%" variant='solid' onClick={() => document.querySelector('input').click()}>
                                            Select from computer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div className="flex w-[100px] absolute right-20 bottom-4">
                    <Button colorScheme='blue' variant='solid' className='w-max p-2' onClick={createChannel}>
                        {createType === 'team' ? 'Create Channel' : 'Create Message Group'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateChannel;
