import React from 'react'

const EmptyChannelState = () => {
  return (
    <div className='w-full h-[80vh] relative items-end'>
        <div className="flex w-max absolute bottom-2 left-4 flex-col rounded-md h-max p-4 border-[1px] border-blue-600">
          <p>This is the beggining of your chat history</p>
          <p>Send messages, emojis , attachments and more !</p>
        </div>
    </div>
  )
}

export default EmptyChannelState