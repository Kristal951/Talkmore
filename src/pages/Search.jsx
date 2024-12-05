import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { queryPosts } from '../lib/AppriteFunction'
import SearchResultCard from '../components/others/SearchResultCard'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Search = () => {
    const [query, setQuery] = useState('')
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    const handleSearch=async(e)=>{
        // const [searchParams] = useSearchParams();
        setQuery(e.target.value)
        // const query = searchParams.get("query"); 
        
        try {
            const res = await queryPosts(query)
            setPosts(res.documents)
        } catch (error) {
            console.log(error);
        }

    }
  return (
    <div className='w-full h-screen bg-[#4b5563] bg-opacity-40 fixed left-[70px] backdrop-blur-sm top-0 right-0 bottom-0 z-[10000] flex items-start p-8 justify-center'>
        <div className="flex w-[50%] gap-2 rounded-md bg-white shadow-md p-4 relative flex-col h-[99%] justify-start items-center searchbar">
            <div className="flex w-full h-max items-center justify-center gap-2">
                <div className="flex">
                    <FaSearch />
                </div>
                <input
                    type='search'
                    className='w-full rounded-md bg-[#4b5563] bg-opacity-15 p-[5px] border-0 focus:outline-none'
                    placeholder='Search anything'
                    value={query}
                    onChange={handleSearch}
                    autoFocus
                />
            </div>
            <div className="flex h-max w-full">
                <div className="flex flex-col w-full">
                    <div className='w-full h-max flex flex-row gap-2 p-2'>
                        <button className='px-3 py-1 bg-blue-600 text-white rounded-md shadow-md '>All</button>
                        <button className='px-3 py-1  text-blue-600 rounded-md shadow-md '>Posts</button>
                        <button className='px-3 py-1 text-blue-600 rounded-md shadow-md '>Chats</button>
                    </div>
                    
                    <div className='w-full h-max'>
                        {
                         posts &&(
                            posts.map((post, i)=>(
                                <SearchResultCard post={post} key={i} />
                            ))
                         )   
                        }
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default Search