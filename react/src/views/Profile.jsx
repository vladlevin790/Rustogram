import React, {useEffect, useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import Burger from "../Components/Burger.jsx";
import UserProfilePost from "../Components/UserProfilePost.jsx";
import toast, {Toaster} from "react-hot-toast";
import Post from "../Components/Post.jsx";
import Story from "../Components/Story.jsx";
import Slider from "react-slick";
import {Link} from "react-router-dom";

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
  const oldEmailRef = useRef();
  const [currentEmail, setCurrentEmail] = useState('');
  const { user, setUser } = useStateContext();
  const [selectedPost, setSelectedPost] = useState(null);
  const [likesData, setLikesData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCreateStory, setIsCreateStory] = useState(false);
  const [storyData,setStoryData] = useState([]);
  const [storyImage, setStoryImage] = useState(null);
  const [storyVideo, setStoryVideo] = useState(null);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({});
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);

  const fetchData = async () => {
    try {
      const [postsResponse, likesResponse] = await Promise.all([
        axiosClient.get('/posts'),
        axiosClient.get('/getLikes'),
      ]);
      const {dataSubscr} = await axiosClient.get(`/subscription_info/${user.id}`);
      const posts = postsResponse.data.map(post => ({
        ...post,
        isLiked: false
      }));
      const likes = likesResponse.data.likes;
      setPostsData(posts);
      setLikesData(likes);
      setSubscriptionData(dataSubscr);
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

  const fetchDataStories = async () => {
    try {
      const response = await axiosClient.get('/stories');
      setStoryData(response.data);
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

  const handleStorySubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('image_path', storyImage);
      formData.append('video_path', storyVideo);
      formData.append('description', storyDescription);
      console.log(formData.get('image_path'))
      const response = await axiosClient.post('/stories/create', formData);
      if (response.data.Success) {
        toast.success('История успешно создана');
        setIsCreateStory(false);
        fetchDataStories();
      } else {
        toast.error('Произошла ошибка при создании истории (если вы пытаетесь загрузить видео, то они в разработке)');
      }
    } catch (error) {
      toast.error('Произошла ошибка при создании истории (если вы пытаетесь загрузить видео, то они в разработке)');
    }
  };


  useEffect(() => {
    setIsAvatar(user.avatar !== null);
    setIsBio(user.bio !== null);
  }, [user.avatar, user.bio]);

  useEffect(() => {
    fetchData();
    fetchDataComments();
    fetchDataStories();
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



  useEffect(() => {
    setCurrentEmail(user.email || '');
  }, [user.email]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newEmail = emailRef.current.value;
      const oldEmail = oldEmailRef.current.value;
      if (oldEmail !== currentEmail) toast("Это не ваша Старая эллектронная почта", { style: { background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
        const formDataToSend = new FormData();
        formDataToSend.append('name', nameRef.current.value);
        formDataToSend.append('email', oldEmail == currentEmail ? newEmail : '');
        formDataToSend.append('bio', bioRef.current.value);
        formDataToSend.append('birthday', birthDayRef.current.value);
        formDataToSend.append('gender', genderRef.current.value);
        if (avatarRef.current.files[0]) {
          formDataToSend.append('avatar', avatarRef.current.files[0]);
        }

        await axiosClient.post('/user_profile/edit', formDataToSend);
        setIsModal(false);
        await axiosClient.get("/user_profile").then(({ data }) => {
          setUser(data);
        });
        toast("Вы успешно обновили аккаунт", { style: { background: "#71D87B", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    } catch (error) {
      console.log(error);
      toast("Что-то пошло не так", { style: { background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    }
  };

  const handleStoryClick = (story, index) => {
    setSelectedStory(story);
    setCurrentStoryIndex(index);
  };

  const postUser = postsData.filter(post => post.user.id === user.id);
  const filteredStories = storyData.filter(story => story.user.id === user.id);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  }

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleStoryChange = (step) => {
    const nextIndex = currentStoryIndex + step;
    if (nextIndex >= 0 && nextIndex < filteredStories.length) {
      setSelectedStory(filteredStories[nextIndex]);
      setCurrentStoryIndex(nextIndex);
    }
  };

  const fetchCountOfSubscriptions = async () => {
    try {
      const { data } = await axiosClient.get(`/subscription_info/${user.id}`);
      setSubscriptionData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const openFollowersModal = () => {
    setFollowersModalOpen(true);
  };

  const fetchFollowers = async () => {
    try {
      const response = await axiosClient.get(`/get_subscribed_users/${user.id}`);
      setFollowers(response.data.subscribed_users);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  useEffect(() => {
      fetchCountOfSubscriptions();
  }, [user]);

  useEffect(() => {
    if (followersModalOpen) {
      fetchFollowers();
    }
  }, [followersModalOpen]);

  return (
    <section className="flex flex-col mt-16">
      <article className="flex ml-60">
        <div className="flex flex-col gap-2 w-[178px]">
          {isAvatar && (<img className="rounded-full w-[130px] h-[130px]" src={user.avatar} alt=""/>)}
          {!isAvatar && (
            <div className="flex  items-center justify-center p-4 bg-gray-300 rounded-full w-[130px] h-[130px]">
              <img src="../../src/media/icons/user.png" alt="" className="w-[68px]"/>
            </div>)}
          <button className="flex items-center font-semibold bg-gray-300 h-8 p-5 rounded" onClick={() => {
            setIsModal(!isModal)
          }}><Burger className="w-6 mt-2"/>Редактировать
          </button>
          <div className="flex gap-4 mt-16 w-[1000px]">
            <button className="bg-gray-300 py-9 px-[52px] rounded-full text-white font-bold text-4xl font-roboto" onClick={() => setIsCreateStory(true)}>
              +
            </button>
            {filteredStories.length === 1 ? (
              <div className="flex flex-col w-[700px] ml-2">
                <div className="relative cursor-pointer">
                  <Story key={filteredStories[0].id} story={filteredStories[0]} onClick={() => handleStoryClick(filteredStories[0], 0)} />
                  <button className="absolute top-0 left-0 w-full h-full" onClick={() => handleStoryClick(filteredStories[0], 0)}></button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-[700px] ml-2">
                <Slider {...settings}>
                  {filteredStories.map((story,index) => (
                    <div className="relative cursor-pointer">
                      <Story key={story.id} story={story} onClick={() => handleStoryClick(story,index)} />
                      <button className="absolute top-0 left-0 w-full h-full  " onClick={()=> handleStoryClick(story,index)}></button>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
            {selectedStory && (
              <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center" onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedStory(null);
                }
              }}>
                <div className="max-w-2xl mx-auto bg-white  rounded">

                  {selectedStory.image_path && (
                    <img src={selectedStory.image_path} alt="Story" className="object-cover h-[691px] w-[770px] mb-4"/>
                  )}
                  {selectedStory.video_path && (
                    <video controls src={selectedStory.video_path}
                           className="object-cover h-[691px] w-[770px] mb-4"></video>
                  )}
                  <h2 className="text-xl font-bold mb-4 ml-4">Описание: {selectedStory.description}</h2>
                  <button
                    className="absolute top-[50%] left-[30%] w-12  bg-gray-400 flex justify-center p-2 rounded-full ml-2 opacity-50"
                    onClick={() => handleStoryChange(-1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    className="absolute top-[50%] right-[30%] w-12  bg-gray-400 flex justify-center p-2 rounded-full mr-2 opacity-50"
                    onClick={() => handleStoryChange(1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          {isModal && (
            <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
              <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsModal(false);
                  }
                }}></div>
              </div>
              <div className="relative bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6 w-[550px]">
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
                  <label htmlFor="oldEmail" className="block mb-4 font-roboto font-weight-bolder text-xl">
                    Предыдущая Эллектронная почта
                    <input
                      type="email"
                      placeholder="Эллектронная почта"
                      id="oldEmail"
                      ref={oldEmailRef}
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
          <p className="font-semibold font-roboto text-3xl cursor-pointer"
             onClick={openFollowersModal}>Подписчиков: {subscriptionData ? subscriptionData.subscriptions_count || 0 : 0}</p>
          {followersModalOpen && (
            <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center"
                 onClick={(e) => {
                   if (e.target === e.currentTarget) {
                setFollowersModalOpen(false);
              }
            }}>
              <div className="max-w-lg mx-auto bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold font-roboto mb-4">Подписчики :</h2>
                <div className="flex flex-col gap-4">
                  {followers.map(follower => (
                    <Link to={`/user_profile/${follower.id}`}><div key={follower.id} className="flex gap-10 items-center mb-2 bg-gray-200 w-[450px] p-4 rounded-xl">
                      {follower.avatar ? (
                        <img className="w-[50px] h-[50px] rounded-full" src={follower.avatar} alt=""/>
                      ) : (
                        <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]"/>
                      )}
                      <p className="font-semibold font-roboto text-2xl">{follower.name}</p>
                    </div></Link>
                  ))}
                </div>
              </div>
            </div>
          )}
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
          <p className="font-semibold font-roboto text-2xl">Дата
            рождения: {new Date(user.birthday).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          <p className="font-semibold font-roboto text-2xl">Пол: {user.gender == 'female' ? 'Женский' : 'Мужской'}</p>
        </div>
        {isCreateStory && (
          <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateStory(false);
            }
          }}>
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Создать историю</h2>
              <label htmlFor="storyImage" className="block mb-2 font-semibold">
                Изображение:
                <div className="mt-1 flex justify-between items-center">
                  <span className="mr-2">{storyImage ? storyImage.name : 'Выберите файл'}</span>
                  <label htmlFor="storyImage" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600">
                    Выбрать
                  </label>
                  <input type="file" accept="image/*" id="storyImage" onChange={(e) => setStoryImage(e.target.files[0])} className="hidden" />
                </div>
              </label>
              <label htmlFor="storyVideo" className="block mb-2 font-semibold">
                Видео:
                <div className="mt-1 flex justify-between items-center">
                  <span className="mr-2">{storyVideo ? storyVideo.name : 'Выберите файл'}</span>
                  <label htmlFor="storyVideo" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600">
                    Выбрать
                  </label>
                  <input type="file" accept="video/*" id="storyVideo" onChange={(e) => setStoryVideo(e.target.files[0])} className="hidden" />
                </div>
              </label>
              <label htmlFor="storyDescription" className="block mb-2 font-semibold">
                Описание:
                <textarea value={storyDescription} onChange={(e) => setStoryDescription(e.target.value)} rows="4" placeholder="Описание истории" className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
              </label>
              <div className="flex justify-end mt-4">
                <button onClick={handleStorySubmit} className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Создать</button>
              </div>
            </div>
          </div>
        )}
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
