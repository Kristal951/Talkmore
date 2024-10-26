import React from 'react'
import { IoIosAddCircle } from 'react-icons/io'

const AddChannelIcon = ({setCreateType, type, isExpanded, setIsCreating, setIsEditing, setToggleContainer}) => {
  return (
    <IoIosAddCircle 
        className={isExpanded ? 'w-[25px] h-[25px] cursor-pointer text-white absolute bottom-0 right-2' : 'w-[25px] h-[25px] cursor-pointer text-blue-600 absolute bottom-0 right-2'}
        onClick={()=>{
            setCreateType(type)
            setIsCreating((prev)=> !prev)
            setIsEditing((false))
            if(setToggleContainer){
                setToggleContainer((prev)=> !prev)
            }
        }}
    />
  )
}

export default AddChannelIcon