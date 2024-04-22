import {Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const fetchUser = () => {
    axiosClient.get("/user_main").then(({ data }) => {
      setUser(data);
    });
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const hideSidebar = location.pathname === "/messages";

  return (
    <div className="flex ">
      {!hideSidebar &&
      <aside className="fixed top-0 flex flex-col gap-[39px] px-[80px] py-10 border-r border-gray-200 h-screen">

        <Link to="/" className="font-rustogram font-bold text-[40px] py-2 hover:text-gray">Rustogram</Link>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/home.png" alt="Home Page"/>
          <Link to="/user_main" className="">Домой</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/search.png" alt="Search Page"/>
          <Link to="/search" className="hover:text-gray-500">Поиск</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/charts.png" alt="Explore Page"/>
          <Link to="/explore" className="hover:text-gray-500">Изучать</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/television.png" alt="Shorts Page"/>
          <Link to="/shorts" className="hover:text-gray-500">Шорсты</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/Chats.png" alt="Messanger Page"/>
          <Link to="/messages" className="hover:text-gray-500">Сообщения</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/images.png" alt="Messanger Page"/>
          <Link to="/create_post" className="hover:text-gray-500">Создать</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/user.png" alt="Profile Page"/>
          <Link to="/profile" className="hover:text-gray-500">Профиль</Link>
        </div>

        <div className="flex items-center gap-[18px] font-bold text-[30px] hover:text-gray">
          <img src="../../src/media/icons/Exit.png" alt="Home Page"/>
          <a onClick={onLogout} className="font-bold text-[30px] hover:text-gray-500" href="#">Выйти</a>
        </div>
      </aside>
      }
      {!hideSidebar && (
      <div className="ml-[394px]">
        <main>
          <Outlet user={user}/>
        </main>
      </div>
      )}
      {hideSidebar && (
        <main>
          <Outlet user={user}/>
        </main>
      )}
    </div>
  )
}
