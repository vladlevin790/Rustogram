import React, {useEffect, useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import Burger from "../Components/Burger.jsx";
import UserProfilePost from "../Components/UserProfilePost.jsx";
import toast, {Toaster} from "react-hot-toast";
import Post from "../Components/Post.jsx";

export default function Profile() {
  const [isAvatar, setIsAvatar] = useState(false);
  const [isBio, setIsBio] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [userOnlineStatus, setUserOnlineStatus] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const bioRef = useRef();
  const passwordRef = useRef();
  const avatarRef = useRef();
  const birthDayRef = useRef();
  const genderRef = useRef();
  const { user, setUser } = useStateContext();
  const [selectedPost, setSelectedPost] = useState(null);
  const [likesData, setLikesData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  const fetchData = async () => {
    try {
      const [postsResponse, likesResponse] = await Promise.all([
        axiosClient.get('/posts'),
        axiosClient.get('/getLikes'),
      ]);
      const posts = postsResponse.data.map(post => ({
        ...post,
        isLiked: false
      }));
      const likes = likesResponse.data.likes;
      setPostsData(posts);
      setLikesData(likes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLikeClick = async (postId) => {
    try {
      const hasLiked = likesData.some(like => like.post && like.post.id === postId && like.user.id === user.id);
      const endpoint = hasLiked ? '/unlike' : '/like';
      const response = await axiosClient.post(endpoint, { post_id: postId });

      if (response.status === 200) {
        const updatedPostsData = postsData.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: hasLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !hasLiked,
            };
          }
          return post;
        });

        setPostsData(updatedPostsData);

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(updatedPostsData.find(post => post.id === postId));
        }

        setLikesData(prevLikesData => {
          return hasLiked
            ? prevLikesData.filter(like => !(like.post && like.post.id === postId))
            : [...prevLikesData, {id: postId, user: user, post: {id: postId}}];
        });
      } else {
        toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
      }
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  const updatePostsList = (postId) => {
    setPostsData(postsData => postsData.filter(post => post.id !== postId));
  };

  const updatePostDescription = (postId, postBio) => {
    setPostsData(postsData => postsData.map(
      post => {
        const updatedPost = post.id === postId ? { ...post, description: postBio } : post;
        setSelectedPost(updatedPost);
        return updatedPost;
      })
    );
  };

  const updatePostImagesOrVideosNumbered = async (postId) => {
    try {
      const response = await axiosClient.get(`posts/select_post/${postId}`);
      const updatedPost = response.data;

      setPostsData(postsData =>
        postsData.map(post => (post.id === postId ? updatedPost : post))
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(updatedPost);
      }
    } catch (error) {
      toast("Произошла ошибка при обновлении поста");
    }
  };


  async function fetchDataComments(postId) {
    try {
      const response = await axiosClient.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
  const handleCommentSubmit = async (postId,postUserId) => {
    try {
      const response = await axiosClient.post(`/posts/${postId}/comments`, {
        user_id: postUserId,
        post_id: postId,
        content: newCommentText,
      });
      const updatedComments = await axiosClient.get(`/posts/${postId}/comments`);
      setComments(updatedComments.data);
      setNewCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  useEffect(() => {
    setIsAvatar(user.avatar !== null);
    setIsBio(user.bio !== null);
  }, [user.avatar, user.bio]);

  useEffect(() => {
    fetchData();
    fetchDataComments();
  }, []);

  useEffect(() => {
    setUserOnlineStatus(user.is_online ? "Онлайн" : `${user.gender == 'female' ? 'была' : 'был'} в сети ${formatLastOnline(user.last_online)}`);
  }, [user.is_online, user.last_online]);


  const formatLastOnline = (lastOnline) => {
    if (!lastOnline) return '';

    const timestamp = new Date(lastOnline);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    let formattedTimeString = '';

    if (timeDifferenceInSeconds < 60) {
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

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', nameRef.current.value);
      formDataToSend.append('email', emailRef.current.value);
      formDataToSend.append('bio', bioRef.current.value);
      formDataToSend.append('password', passwordRef.current.value);
      formDataToSend.append('birthday',birthDayRef.current.value);
      formDataToSend.append('gender', genderRef.current.value);
      if (avatarRef.current.files[0]) {
        formDataToSend.append('avatar', avatarRef.current.files[0]);
      }

      await axiosClient.post('/user_profile/edit', formDataToSend);
      setIsModal(false);
      await axiosClient.get("/user_profile").then(({ data }) => {
        setUser(data);
      });
      toast("Вы успешно обновили аккаунт",{style:{background:"#71D87B", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  const postUser = postsData.filter(post => post.user.id === user.id);

  return (
    <section className="flex flex-col mt-16">
      <article className="flex ml-60">
        <div className=" flex flex-col gap-2 w-[178px]">
          {isAvatar && (<img className="rounded-full w-[130px] h-[130px]" src={user.avatar} alt="" />)}
          {!isAvatar && (<div className="flex  items-center justify-center p-4 bg-gray-300 rounded-full w-[130px] h-[130px]">
            <img src="../../src/media/icons/user.png" alt="" className="w-[68px]" />
          </div>)}
          <button className="flex items-center font-semibold bg-gray-300 h-8 p-5 rounded" onClick={() => { setIsModal(!isModal) }}><Burger className="w-6 mt-2" />Редактировать</button>
          {isModal && (
            <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsModal(false);
                  }
                }}></div>
              </div>
              <div className="relative bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6 w-[550px]" >
                <form onSubmit={handleSubmit}>
                  <label htmlFor="nickname" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Изменить никнейм
                    <input
                      type="text"
                      placeholder="Никнейм"
                      id="nickname"
                      ref={nameRef}
                      className="mt-1 block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 bg-gray-100 p-2 transition hover:bg-gray-200 hover:placeholder:text-gray-900"
                    />
                  </label>
                  <label htmlFor="bio" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Изменить биографию
                    <input
                      type="text"
                      placeholder="Биография"
                      id="bio"
                      ref={bioRef}
                      className="mt-1 block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 bg-gray-100 p-2 transition hover:bg-gray-200 hover:placeholder:text-gray-900"
                    />
                  </label>
                  <label htmlFor="email" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Изменить Электронную почту
                    <input
                      type="email"
                      placeholder="Эллектронная почта"
                      id="email"
                      ref={emailRef}
                      className="mt-1 block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 bg-gray-100 p-2 transition hover:bg-gray-200 hover:placeholder:text-gray-900"
                    />
                  </label>
                  <label htmlFor="password" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Пароль
                    <input
                      type="password"
                      placeholder="Пароль"
                      id="password"
                      ref={passwordRef}
                      className="mt-1 block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 bg-gray-100 p-2 transition hover:bg-gray-200 hover:placeholder:text-gray-900"
                    />
                  </label>
                  <label htmlFor="birthday" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Изменить дату дня рождения
                    <input
                      type="date"
                      id="birthday"
                      name="birthday"
                      ref={birthDayRef}
                      className="mt-1 block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 bg-gray-100 p-2 transition hover:bg-gray-200 hover:placeholder:text-gray-900"
                    />
                  </label>
                  <label htmlFor="gender" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Изменить пол
                    <select
                      ref={genderRef}
                      id="gender"
                      className="mt-1 block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12 bg-gray-100 p-2 transition hover:bg-gray-200 hover:placeholder:text-gray-900"
                    >
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </select>
                  </label>
                  <label htmlFor="avatar" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Изменить аватар
                    <label className="cursor-pointer">
                    <span
                      className="block w-full rounded border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3  h-12 bg-gray-100 p-2 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ">
                      Выберите файл
                    </span>
                      <input
                        type="file"
                        name="avatar"
                        accept=".png, .jpg, .jpeg"
                        id="avatar"
                        ref={avatarRef}
                        className="hidden"
                      />
                    </label>
                  </label>
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-roboto font-weight-bolder text-xl"
                  >
                    Подтвердить
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col ml-9 mt-5">
          <h2 className="font-bold font-roboto text-4xl mb-2">{user.name}</h2>
          {userOnlineStatus && (<>
            {userOnlineStatus == "Онлайн" ?
              <div className="flex align-content-center items-center gap-1">
                <p className="text-2xl text-green-700">◉</p>
                <p className="font-semibold font-roboto text-2xl text-green-700">{userOnlineStatus}</p>
              </div> : <p className="font-semibold font-roboto text-2xl text-green-700">{userOnlineStatus}</p>
            }
          </>)}
          {isBio && (<p className="font-semibold font-roboto text-2xl">{user.bio}</p>)}
          {!isBio && (<p className="font-roboto font-semibold text-2xl">Информация отсутствует</p>)}
          <p className="font-semibold font-roboto text-2xl">Дата рождения: {new Date(user.birthday).toLocaleDateString('ru-RU',{year: 'numeric', month: 'long', day: 'numeric'})}</p>
          <p className="font-semibold font-roboto text-2xl">Пол: {user.gender == 'female' ? 'Женский' : 'Мужской'}</p>
        </div>
      </article>
      <article className="border-b mt-5 mb-5"></article>
      <article className="flex justify-between ">
        <div className="flex flex-wrap gap-20 mt-10 ml-10">
          {postUser.map(post => (
            <div key={post.id} onClick={() => setSelectedPost(post)}>
              <UserProfilePost post={post} />
            </div>
          ))}
        </div>
      </article>
      {selectedPost && (
        <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setSelectedPost(null);
               }
             }}>
          <div className="max-w-screen-lg mx-auto mt-6 max-h-screen overflow-y-auto">
            <Post post={selectedPost} onLikeClick={handleLikeClick} isOwner={selectedPost.user.id == user.id} likesData={likesData} user={user} comments={comments} handleCommentSubmit={handleCommentSubmit} newCommentText={newCommentText} setNewCommentText={setNewCommentText} updatePostDescription={updatePostDescription} updatePostImagesOrVideosNumbered={updatePostImagesOrVideosNumbered} updatePostsList={updatePostsList} />
          </div>
        </div>
      )}
      <Toaster/>
    </section>
  );
}
