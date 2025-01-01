import React, { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { Spinner } from "@chakra-ui/react";
import UserItem from "./UserItem";

const ListContainer = ({ children }) => {
  return (
    <div className="p-4 border rounded-md shadow-sm dark:bg-darkBackground2 bg-white max-h-[400px] overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">User</p>
        <p className="text-lg font-semibold">Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserList = ({ setSelectedUser, selectedUser }) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 8 }
        );

        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };

    if (client) getUsers();
  }, [client]);

  if (loading) {
    return (
      <ListContainer>
        <div className="flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </ListContainer>
    );
  }

  if (error) {
    return (
      <ListContainer>
        <div className="text-center text-red-500">
          Error loading users. Please try again later.
        </div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className="text-center text-gray-500">No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <div className="flex flex-row gap-4 overflow-x-auto">
        {users.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        ))}
      </div>
    </ListContainer>
  );
};

export default UserList;
