import React, { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import SearchResultCard from "./SearchResultCard";

const Search = () => {
  const { client, setActiveChannel } = useChatContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamChannels, setTeamChannels] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);

  useEffect(()=>{
    if(searchTerm.length === 0) {
      setTeamChannels([]);
      setDirectMessages([]);
    }
  }, [searchTerm])

  const handleSearch = async (term) => {
    setLoading(true)
    const cleanedTerm = term.trim();
  
    if (!cleanedTerm) {
      setTeamChannels([]);
      setDirectMessages([]);
      return;
    }
  
    try {
      const getChannelsResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: cleanedTerm },
        members: { $in: [client.userID] },
      });
  
      const getUserResponse = client.queryUsers({
        id: { $ne: client.userID },
        name: { $autocomplete: cleanedTerm },
      });
  
      const [channels, users] = await Promise.all([getChannelsResponse, getUserResponse]);
  
      if (channels.length > 0) setTeamChannels(channels);
      else setTeamChannels([]);
  
      if (users.length > 0) setDirectMessages(users);
      else setDirectMessages([]);
  
    } catch (error) {
      setError(error);
      setTeamChannels([]);
      setDirectMessages([]);
    }finally{
        setLoading(false)
    }
  };
  

  const handleSearchChange = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);
  };

  const setChannel =(channel)=>{
    setSearchTerm("");
    setActiveChannel(channel);
  }
  return (
    <div className="w-full h-max relative flex items-stretch p-2 my-2">
      <input
        type="text"
        placeholder="Search for channels or messages"
        className="w-full h-10 px-4 border border-primary rounded-md focus:outline-none dark:placeholder-green-50 focus:ring-2 focus:ring-primary dark:bg-darkBackground2 dark:border-gray-600 dark:text-white"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {
        searchTerm && (
            <SearchResultCard
                loading={loading}
                error={error}
                teamChannels={teamChannels}
                directMessages={directMessages}
                setChannel={setChannel}
                setSearchTerm={setSearchTerm}
                setTeamChannels={setTeamChannels}
            />
        )
      }
    </div>
  );
};

export default Search;
