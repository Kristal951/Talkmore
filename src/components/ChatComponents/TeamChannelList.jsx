import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import AddChannelIcon from './AddChannelIcon';
import './index.css'

const TeamChannelList = ({ children, error, loading, type, isCreating, setCreateType, setIsCreating, setIsEditing, setToggleContainer }) => {
    // Render error state
    if (error) {
        return type === 'team' ? (
            <div className="w-full h-screen flex justify-center items-center">
                <p className='text-red-600'>Connection error, please wait and try again later.</p>
            </div>
        ) : null;
    }

    // Render loading state
    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <p className='text-blue-600'>{type === 'team' ? 'Channels' : 'Messages'} are loading...</p>
            </div>
        );
    }

    // Render the team channels or direct messages based on type
    return (
        <Accordion allowToggle className='w-full h-full flex flex-col gap-4'>
            <AccordionItem>
                {({ isExpanded }) => (
                    <>
                        <AccordionButton _expanded={{ bg: 'blue', color: 'white' }} className="flex justify-between items-center w-full h-max" onClick={setToggleContainer}>
                            <h3 className={ isExpanded ? 'text-white font-bold text-xl' : "text-blue-600 font-bold text-xl" }>
                                {type === 'team' ? "#Channels" : "#Messages"}
                            </h3>
                            <div className="flex w-full h-[30px] relative">
                                <AddChannelIcon
                                    isCreating={isCreating}
                                    setIsCreating={setIsCreating}
                                    setCreateType={setCreateType}
                                    setIsEditing={setIsEditing}
                                    type={type}
                                    isExpanded={isExpanded}
                                />
                            </div>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel columnGap={4} overflowY="scroll" height="100%" className="flex flex-col w-full h-full gap-4">
                            {/* <div className="w-full h-ful overflow-y-scroll"> */}
                                {children}
                            {/* </div> */}
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
        </Accordion>
    );
};

export default TeamChannelList;
