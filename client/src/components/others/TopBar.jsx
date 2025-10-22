import { Avatar, Spinner } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";
import axios from "axios";
import { UserContext } from "../../Contexts/UserContext";
import { IoMdNotificationsOutline } from "react-icons/io";
import MobileNav from "./MobileNav";
import { MdOutlineCancel } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { userDetails } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }

    setSearching(true);
    try {
      const res = await axios.post("http://localhost:5000/user/searchUser", {
        query,
      });
      setFilteredUsers(res.data?.users?.documents || []);
    } catch (error) {
      console.error("Search error:", error.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[60px] z-40 flex items-cente justify-betweenr px-2 md:px-6 border-b border-primary bg-white dark:bg-darkBackground2">
      {/* Left - Logo */}
      <div className="items-center w-auto hidden md:w-[20%] md:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-base md:text-xl">
            Talkmore
          </span>
        </Link>
      </div>

      {/* Center - Search (1fr style) */}
      <div className="flex-1 flex  mx-4 relative justify-center">
        <div className="md:justify-center flex w-full items-center">
          <div className="flex relative w-full">
            <input
              type="search"
              placeholder="Search Talkmore..."
              className="w-full md:w-[50%] placeholder-green-200 dark:bg-background2 h-[40px] pl-10 pr-4 text-primary font-semibold border border-primary rounded-xl outline-none focus:ring-0"
              value={searchQuery}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
          </div>
        </div>
        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="absolute w-full mt-2 bg-white dark:bg-darkBackground2 rounded-b-lg shadow-lg p-4 flex flex-col gap-2 z-20">
            {searching ? (
              <div className="flex justify-center items-center">
                <Spinner size="sm" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <>
                <p className="text-center text-primary font-semibold">
                  No users found
                </p>
                <Link
                  to={`/Search/${searchQuery}`}
                  className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <CiSearch />
                  <span className="text-primary font-semibold">
                    Search for "{searchQuery}"
                  </span>
                </Link>
              </>
            ) : (
              <>
                {filteredUsers.map((user) => (
                  <SearchResultCard
                    key={user.$id}
                    user={user}
                    searchQuery={searchQuery}
                  />
                ))}
                <Link
                  to={`/Search/${searchQuery}`}
                  className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <CiSearch />
                  <span className="text-primary font-semibold">
                    Search for "{searchQuery}"
                  </span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right - Icons/Profile */}
      <div className="flex items-center gap-2 w-auto md:w-[20%] justify-end">
        <div className="p-1 hover:bg-green-50 rounded-full cursor-pointer hidden md:flex">
          <IoMdNotificationsOutline className="text-primary w-[30px] h-[30px]" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link
            to={`/profile/${userDetails?.id}`}
            className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-full cursor-pointer"
          >
            <Avatar name={userDetails?.name} src={userDetails?.imgUrl} />
          </Link>
        </div>
        <div className="md:hidden cursor-pointer z-50">
          {isSidebarOpen ? (
            <MdOutlineCancel
              size={28}
              onClick={toggleSidebar}
              className="text-primary font-bold"
            />
          ) : (
            <IoMenuSharp
              size={28}
              onClick={toggleSidebar}
              className="text-primary font-bold"
            />
          )}
        </div>
        {isSidebarOpen && <MobileNav toggleSidebar={toggleSidebar} />}
      </div>
    </div>
  );
};

export default TopBar;
