import React from 'react'
import Page_Not_Found from '../assets/images/Not_Found.png'

const Not_Found = () => {
  return (
    <div className="w-full h-screen justify-center items-center flex flex-col dark:bg-darkBackground">
        <img src={Page_Not_Found} alt="Page Not Found" className="w-full h-[80%] object-contain" />
        <div className="flex">
          <h1 className='uppercase text-4xl font-bold text-primary'>Page not found</h1>
        </div>
    </div>
  )
}

export default Not_Found