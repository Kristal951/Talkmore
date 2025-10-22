import React from "react";
import { Avatar, Spinner } from "@chakra-ui/react";
import { useChatContext } from "stream-chat-react";
import { RiGroup2Fill } from "react-icons/ri";

const SearchResultCard = ({
  loading,
  error,
  teamChannels,
  directMessages,
  setChannel,
  setSearchTerm,
  setTeamChannels,
}) => {
  const { client } = useChatContext();

  //   const handleChannelClick = (channel) => {
  //     setChannel(channel);
  //     setTeamChannels([]);
  //   };

  //   const handleUserClick = async (user) => {
  //     const existingChannel = client.channel('messaging', {
  //       members: [client.userID, user.id],
  //     });
  //     await existingChannel.watch();
  //     handleChannelClick(existingChannel);
  //   };
  console.log(directMessages);

  return (
    <div className="w-[300px] max-h-[400px] overflow-y-auto p-2 top-[50px] absolute shadow-lg text-primary bg-white dark:bg-darkBackground2 rounded-md flex flex-col z-50">
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="md" />
        </div>
      )}

      {error && (
        <p className="text-red-500 px-4">Search error: {error.message}</p>
      )}

      {!loading && !error && (
        <>
          <div className="flex w-full h-max flex-col gap-2">
            <h1 className="text-primary text-[20px] font-bold">Channels:</h1>
            <div className="flex w-full h-max">
              {teamChannels.length > 0 && (
                // <div className="mb-2">
                <>
                  {teamChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex w-full p-2 hover:bg-gray-100 dark:hover:bg-darkBackground cursor-pointer"
                      //   onClick={() => handleChannelClick(channel)}
                    >
                        {channel?.data?.image ? (
                                <img
                                  src={channel?.data.image }
                                  alt="Channel Avatar"
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <RiGroup2Fill
                                  size={40}
                                  className="text-primary"
                                />
                              )}
                      <span className="font-medium">
                        {channel.data.name || channel.id}
                      </span>
                    </div>
                  ))}
                  {
                    teamChannels.length === 0 && (
                        <h1 className="text-primary font-bold">No results found</h1>
                    )
                  }
                </>
                // </div>
              )}
            </div>
          </div>

          <div className="flex w-full h-max flex-col gap-2">
            <h1 className="text-primary text-[20px] font-bold">Direct Messages:</h1>
            <div className="flex w-full h-max">
              {directMessages.length > 0 && (
                // <div className="mb-2">
                <>
                  {directMessages.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex flex-col p-2 hover:bg-gray-100 dark:hover:bg-darkBackground cursor-pointer"
                      //   onClick={() => handleChannelClick(channel)}
                    >
                        {channel?.data?.image ? (
                                <img
                                  src={channel?.data.image }
                                  alt="Channel Avatar"
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <RiGroup2Fill
                                  size={40}
                                  className="text-primary"
                                />
                              )}
                      <span className="font-medium">
                        {channel.data.name || channel.id}
                      </span>
                    </div>
                  ))}
                  {
                    directMessages.length === 0 && (
                        <h1 className="text-primary font-bold">No results found</h1>
                    )
                  }
                </>
                // </div>
              )}
            </div>
          </div>

          {/* {directMessages.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold px-2 mb-1">Users</h4>
              {directMessages.map(({ user }) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-darkBackground cursor-pointer"
                //   onClick={() => handleUserClick(user)}
                >
                  <Avatar size="sm" name={user.name} src={user.image} />
                  <span className="font-medium">{user.name || user.id}</span>
                </div>
              ))}
            </div>
          )}

          {teamChannels.length === 0 && directMessages.length === 0 && (
            <p className="text-gray-500 px-4">No results found.</p>
          )} */}
        </>
      )}
    </div>
  );
};

export default SearchResultCard;
