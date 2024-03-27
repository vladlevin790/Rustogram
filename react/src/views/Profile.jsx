import React, { useEffect, useState, useRef } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import Burger from "../Components/Burger.jsx";
import UserProfilePost from "../Components/UserProfilePost.jsx";

export default function Profile() {
  const [isAvatar, setIsAvatar] = useState(false);
  const [isBio, setIsBio] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const bioRef = useRef();
  const passwordRef = useRef();
  const avatarRef = useRef();
  const { user } = useStateContext();

  const fetchData = async () => {
    try {
      const [postsResponse, likesResponse] = await Promise.all([
        axiosClient.get('/posts'),
      ]);
      const posts = postsResponse.data.map(post => ({
        ...post,
      }));
      setPostsData(posts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    setIsAvatar(user.avatar !== null);
    setIsBio(user.bio !== null);
  }, [user.avatar, user.bio]);

  useEffect(() => {
    fetchData();
    console.log(user);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', nameRef.current.value);
      formDataToSend.append('email', emailRef.current.value);
      formDataToSend.append('bio', bioRef.current.value);
      formDataToSend.append('password', passwordRef.current.value);
      if (avatarRef.current.files[0]) {
        formDataToSend.append('avatar', avatarRef.current.files[0]);
      }

      await axiosClient.post('/user_profile/edit', formDataToSend);
      fetchData();
      setIsModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const postUser = postsData.filter(post => post.user.id === user.id);

  return (
    <section className="flex flex-col mt-16">
      <article className="flex ml-60">
        <div className=" flex flex-col gap-2 w-[178px]">
          <div className="flex  items-center justify-center p-4 bg-gray-300 rounded-full w-[130px] h-[130px]">
            {!isAvatar && (<img src="../../src/media/icons/user.png" alt="" className="w-[68px]" />)}
            {isAvatar && (<img src={user.avatar} alt="" />)}
          </div>
          <button className="flex items-center font-semibold bg-gray-300 h-8 p-5 rounded" onClick={() => { setIsModal(!isModal) }}><Burger className="w-6 mt-2" />Редактировать</button>
          {isModal && (
            <div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="nickname">
                  Изменить никнейм
                  <input type="text" placeholder="Никнейм" id="nickname" ref={nameRef} />
                </label>
                <label htmlFor="bio">
                  Изменить биографию
                  <input type="text" placeholder="Биография" id="bio" ref={bioRef} />
                </label>
                <label htmlFor="email">
                  Изменить Электронную почту
                  <input type="email" placeholder="Эллектронная почта" id="email" ref={emailRef} />
                </label>
                <label htmlFor="password">
                  Пароль
                  <input type="password" placeholder="password" id="password" ref={passwordRef} />
                </label>
                <label htmlFor="">
                  Изменить аватар
                  <input
                    type="file"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    id="avatar"
                    ref={avatarRef}
                  />
                </label>
                <button type="submit">Подтвердить</button>
              </form>
            </div>
          )}
        </div>
        <div className="flex flex-col ml-9 mt-5">
          <h2 className="font-bold text-4xl">{user.name}</h2>
          {/*<p>online</p>*/}
          {isBio && (<p className="font-semibold text-2xl">{user.bio}</p>)}
        </div>
      </article>
      <article className="border-b mt-5 mb-5"></article>
      <article className="flex justify-between ">
        <div className="flex flex-wrap gap-20 mt-10 ml-10">
          {postUser.map(post => (
            <UserProfilePost key={post.id} post={post} className="hover:opacity-10" />
          ))}
        </div>
      </article>
    </section>
  )
}
