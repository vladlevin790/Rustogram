import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Link } from "react-router-dom";

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState({ id:null, name: "", avatar: null, onlineStatus: "" });
  const [newMessage, setNewMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const searchRef = useRef();
  const { user } = useStateContext();
  const messagesEndRef = useRef(null);

  const fetchChats = () => {
    axiosClient
      .get("/get_chats")
      .then((response) => {
        setChats(response.data);
      })
      .catch((error) => {
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
      return "";
    }
    if (hours >= 2 && hours <= 4) {
      return "а";
    }
    return "ов";
  };

  const getMinutesSuffix = (minutes) => {
    if (minutes === 1) {
      return "у";
    }
    if (minutes >= 2 && minutes <= 4) {
      return "ы";
    }
    return "";
  };

  const getDaysSuffix = (days) => {
    if (days === 1) {
      return "ень";
    }
    if (days >= 2 && days <= 4) {
      return "ня";
    }
    return "ней";
  };

  const formatLastOnline = (lastOnline, isOnline) => {
    if (!lastOnline) return "";

    const timestamp = new Date(lastOnline);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    let formattedTimeString = "";

    if (timeDifferenceInSeconds < 60 || isOnline) {
      formattedTimeString = "только что";
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
    axiosClient
      .get(`/search_user/chat/${username}`)
      .then((response) => {
        setSearchResults([response.data]);
      })
      .catch((error) => {
        console.error("Error searching user:", error);
        setSearchResults([]);
      });
  };

  const handleSearchStartClick = (userId) => {
    try {
      axiosClient.post(`/search_user/create_chat/${userId}`);
      axiosClient.get("/get_chats").then((response) => {
        setChats(response.data);
      });
      setSearchResults([]);
    } catch (error) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = searchRef.current.value;
    searchUser(username);
  };

  const getAllMessagesFromChat = (userId, chatId) => {
    axiosClient
      .get(`/get_all_from_chat/${chatId}/${userId}`)
      .then((response) => {
        setMessages(response.data);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const handleUserClick = (id, name, avatar, onlineStatus) => {
    setSelectedUser({id, name, avatar, onlineStatus });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentNode;
      container.scrollTo({
        top: container.scrollHeight - container.clientHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chats.length > 0) {
      const updatedChats = chats.map((chat) => {
        const lastOnlineMoscowTime = gmtToMoscowTime(chat.second_user.last_online);
        const userOnlineStatus = chat.second_user.is_online == 0 ? "Онлайн" : `${chat.second_user.gender === "female" ? "Была" : "Был"} в сети ${formatLastOnline(lastOnlineMoscowTime, chat.second_user.is_online == 0)}`;
        return { ...chat, userOnlineStatus };
      });
      setChats(updatedChats);
    }
  }, [chats.length]);

  const sendMessage = () => {
    if (!selectedChatId) return;
    axiosClient
      .post(`/send_message/${selectedChatId}/${selectedUser.id}`, { message: newMessage })
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <main className="flex">
      <section className="flex flex-col gap-6 border-r p-10 h-screen">
        <h2 className="font-rustogram text-5xl">Rustogram</h2>
        <article className="relative flex rounded-xl gap-6 bg-gray-200 p-4">
          <input className="border-none bg-transparent w-full p-1" ref={searchRef} type="text" placeholder="поиск" />
          <button onClick={handleSubmit}>Поиск</button>
        </article>
        {searchResults && (
          <>
            {searchResults.map((searchRes) => (
              <div
                key={searchRes.id}
                className="flex items-center rounded-xl cursor-pointer w-[300px] h-[53px] p-3 gap-4 font-roboto text-l bg-gray-200"
                onClick={() => handleSearchStartClick(searchRes.id)}
              >
                {searchRes.avatar !== null ? <img src={searchRes.avatar} alt="" /> : <img src="../../src/media/icons/user.png" alt="" />}
                <p>{searchRes.name}</p>
              </div>
            ))}
          </>
        )}
        <article className="flex flex-col gap-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center rounded-xl cursor-pointer w-[300px] h-[53px] p-3 gap-4 font-roboto text-l bg-gray-200"
              onClick={() => {getAllMessagesFromChat(chat.second_user.id, chat.id)
                handleUserClick(chat.second_user.id, chat.second_user.name, chat.second_user.avatar, chat.userOnlineStatus)
                setSelectedChatId(chat.id);
              }}
            >
              {chat.second_user.avatar !== null ? <img src={chat.second_user.avatar} alt="" /> : <img src="../../src/media/icons/user.png" alt="" />}
              <div className="flex flex-col">
                <h2>{chat.second_user.name}</h2>
                {chat.userOnlineStatus && (
                  <>
                    {chat.userOnlineStatus === "Онлайн" ? (
                      <div className="flex align-content-center items-center gap-1">
                        <p className="text-l text-green-700">◉</p>
                        <p className="font-semibold font-roboto text-l text-green-700">{chat.userOnlineStatus}</p>
                      </div>
                    ) : (
                      <p className="font-roboto text-l font-thin">{chat.userOnlineStatus}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </article>
        <article className="flex items-center gap-10 mt-auto">
          <Link to="/profile" className="flex items-center font-roboto text-xl hover:text-blue-700">
            <span className="mr-1 flex items-center gap-2 ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Вернуться
            </span>
          </Link>
          <h2 className="font-roboto text-2xl font-bold">Чаты</h2>
          {user.avatar !== null ? (
            <img src={user.avatar} alt="" className="rounded-full h-[37px] w-[37px]" />
          ) : (
            <div className="flex justify-center items-center rounded-full h-[70px] w-[70px] bg-gray-200">
              <img src="../../src/media/icons/user.png" alt="" className="object-cover h-[48px] w-[47px]" />
            </div>
          )}
        </article>
      </section>
      <section className="flex flex-col w-[1265px] h-screen  gap-6">
        <article className="flex flex-col items-center gap-4 border-b-2">
          <div className="flex justify-center border-b-2 p-10 w-full">
            <div className="flex items-center gap-4 bg-gray-200 px-5 py-3 rounded-xl">
              {selectedUser.avatar !== null ? (
                <img src={selectedUser.avatar} alt="" className="rounded-full h-[37px] w-[37px]"/>
              ) : (
                <div className="flex justify-center items-center rounded-full h-[70px] w-[70px] bg-gray-200">
                  <img src="../../src/media/icons/user.png" alt="" className="object-cover h-[48px] w-[47px]"/>
                </div>
              )}
              <div className="font-roboto flex flex-col">
                <h2 className="font-bold text-xl">{selectedUser.name}</h2>
                {selectedUser.onlineStatus && (
                  <>
                    {selectedUser.onlineStatus === "Онлайн" ? (
                      <div className="flex align-content-center items-center gap-1">
                        <p className="text-l text-green-700">◉</p>
                        <p className="font-semibold font-roboto text-l text-green-700">{selectedUser.onlineStatus}</p>
                      </div>
                    ) : (
                      <p className="font-roboto text-l font-thin">{selectedUser.onlineStatus}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse h-[550px] gap-4 w-full overflow-y-auto">
            {messages.length === 0 && (
              <div className="font-roboto text-center text-gray-500">Начните диалог, написав "привет;)"</div>
            )}
            {messages.slice(0).reverse().map((message) => (
              <div key={message.id}
                   className={message.owner_id == user.id ? 'ml-auto font-roboto text-white p-3 rounded-xl text-xl bg-[#534CA5] w-max' : 'mr-auto font-roboto text-white p-3 rounded-xl text-xl bg-[#547B84] w-max'}>
                {message.message}
              </div>
            ))}
            <div ref={messagesEndRef}/>
          </div>
        </article>

        <article className="flex items-center">
          <div className="flex-grow">
            <input type="text" className="border rounded-md py-2 px-4 w-full" value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}/>
          </div>
          <button onClick={sendMessage}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 ml-2 rounded-md">Отправить
          </button>
        </article>
      </section>
    </main>
  );
}
