import React, {useEffect, useRef, useState} from "react";
import axiosClient from "../axios-client.js";

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef();

  const fetchChats = () => {
    axiosClient.get("/get_chats")
      .then(response => {
        setChats(response.data);
      })
      .catch(error => {
        console.error("Error fetching chats:", error);
      });
  };

  const gmtToMoscowTime = (gmtTime) => {
    const moscowOffset = 3;
    const gmtDate = new Date(gmtTime);
    const moscowTime = new Date(gmtDate.getTime() + moscowOffset * 3600000);
    return moscowTime;
  };

  const getHoursSuffix = (hours) => {
    if (hours === 1) {
      return '';
    }
    if (hours >= 2 && hours <= 4) {
      return 'а';
    }
    return 'ов';
  };

  const getMinutesSuffix = (minutes) => {
    if (minutes === 1) {
      return 'у';
    }
    if (minutes >= 2 && minutes <= 4) {
      return 'ы';
    }
    return '';
  };

  const getDaysSuffix = (days) => {
    if (days === 1) {
      return 'ь';
    }
    if (days >= 2 && days <= 4) {
      return 'я';
    }
    return '';
  };

  const formatLastOnline = (lastOnline, isOnline) => {
    if (!lastOnline) return '';

    const timestamp = new Date(lastOnline);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    let formattedTimeString = '';

    if (timeDifferenceInSeconds < 60 || isOnline) {
      formattedTimeString = 'только что';
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      formattedTimeString = `${minutesAgo} минут${getMinutesSuffix(minutesAgo)} назад`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      formattedTimeString = `${hoursAgo} час${getHoursSuffix(hoursAgo)} назад`;
    } else {
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      formattedTimeString = `${daysAgo} д${getDaysSuffix(daysAgo)} назад`;
    }

    return formattedTimeString;
  };

  const searchUser = (username) => {
    axiosClient.get(`/search_user/chat/${username}`)
      .then(response => {
        setSearchResults([response.data]);
      })
      .catch(error => {
        console.error("Error searching user:", error);
        setSearchResults([]);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = searchRef.current.value;
    searchUser(username);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      const updatedChats = chats.map(chat => {
        const lastOnlineMoscowTime = gmtToMoscowTime(chat.second_user.last_online);
        const userOnlineStatus = chat.second_user.is_online ? 'Онлайн' : `${chat.second_user.gender === 'female' ? 'Была' : 'Был'} в сети ${formatLastOnline(lastOnlineMoscowTime, chat.second_user.is_online)}`;
        return { ...chat, userOnlineStatus };
      });
      setChats(updatedChats);
    }
  }, [chats]);

  console.log(searchResults);

  return (
    <main className="flex">
      <section className="flex flex-col gap-10 border-r p-10">
        <h2 className="font-rustogram  text-5xl">Rustogram</h2>
        <article className="relative flex rounded-xl gap-2 bg-gray-200 p-4">
          <input className="border-none bg-transparent w-full p-1" ref={searchRef}  type="text" placeholder="поиск"/>
          <button onClick={handleSubmit}>Поиск</button>
        </article>
        {searchResults && (
          <>
          {searchResults.map(seacrhRes => (
            <div key={seacrhRes.id}>
              <p>{seacrhRes.name}</p>
            </div>
          ))}
          </>
        )}
        <article className="flex flex-col">
          {chats.map(chat => (
            <div key={chat.id} className="flex items-center rounded-xl cursor-pointer w-[300px] h-[53px] p-3 gap-4 font-roboto text-l bg-gray-200">
              {chat.second_user.avatar !== null ? (
                <img src={chat.second_user.avatar} alt="" />
              ) : (
                <img src="../../src/media/icons/user.png" alt="" />
              )}
              <div className="flex flex-col">
                <h2>{chat.second_user.name}</h2>
                {chat.userOnlineStatus && (
                  <>
                    {chat.userOnlineStatus === "Онлайн" ?
                      <div className="flex align-content-center items-center gap-1">
                        <p className="text-l text-green-700">◉</p>
                        <p className="font-semibold font-roboto text-l text-green-700">{chat.userOnlineStatus}</p>
                      </div> :
                      <p className="font-roboto text-l font-thin">{chat.userOnlineStatus}</p>
                    }
                  </>
                )}
              </div>
            </div>
          ))}
        </article>
      </section>
      <section>

      </section>
    </main>
  );
}
