import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import UserProfilePost from "../Components/UserProfilePost.jsx";
import Post from "../Components/Post.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function AnotherUserProfile() {
  const [userData, setUserData] = useState(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const [isBio, setIsBio] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [userOnlineStatus, setUserOnlineStatus] = useState("");
  const [subscriptionData, setSubscriptionData] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { userId } = useParams();
  const { user } = useStateContext();
  const isOwner = userId == user.id;

  useEffect(() => {
    fetchDataUser();
    fetchPostData();
    fetchCountOfSubscriptions();
  }, [user]);

  const fetchDataUser = async () => {
    try {
      const { data } = await axiosClient.get(`/user_profile/another_user/${userId}`);
      setUserData(data);
      setIsAvatar(data.avatar !== null);
      setIsBio(data.bio !== null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCountOfSubscriptions = async () => {
    try {
      const { data } = await axiosClient.get(`/subscription_info/${userId}`);
      setSubscriptionData(data);
      const isUserSubscribed = data.user_ids.includes(user.id);
      setIsSubscribed(isUserSubscribed);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  const fetchPostData = async () => {
    try {
      const [postsResponse, likesResponse] = await Promise.all([
        axiosClient.get(`/posts/another_user/${userId}`),
        axiosClient.get('/getLikes')
      ]);
      const posts = postsResponse.data.map(post => ({
        ...post,
        isLiked: false
      }));
      const likes = likesResponse.data.likes;
      setPostsData(posts);
      setLikesData(likes);
      posts.forEach(post => {
        fetchDataComments(post.id);
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  useEffect(() => {
    if (userData) {
      const lastOnlineMoscowTime = gmtToMoscowTime(userData.last_online);
      setUserOnlineStatus(userData.is_online ? 'Онлайн' : `${userData.gender === 'female' ? 'Была' : 'Был'} в сети ${formatLastOnline(lastOnlineMoscowTime)}`);
    }
  }, [userData]);

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

  const formatLastOnline = (lastOnline) => {
    if (!lastOnline) return '';

    const timestamp = new Date(lastOnline);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    let formattedTimeString = '';

    if (timeDifferenceInSeconds < 60 || userData.is_online) {
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

  const handleSubscribeClick = async () => {
    try {
      await axiosClient.post(`/subscribe_user/${user.id}/${userId}`);
      setIsSubscribed(true);
      const {data} = await axiosClient.get(`/subscription_info/${userId}`);
      setSubscriptionData(data);
      toast.success("Вы успешно подписались");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Ошибка при подписке");
    }
  };

  const handleUnSubscribeClick = async () => {
    try {
      const subscriptions = subscriptionData.subscriptions;
      const targetSubscription = subscriptions.find(subscription => subscription.user_id === user.id);
      if (targetSubscription) {
        try {
          const subscriptionId = targetSubscription.id;
          const response = await axiosClient.delete(`/delete_subscription/${user.id}/${subscriptionId}`);

          if (response.data.Success) {
            setIsSubscribed(false);
            const {data} = await axiosClient.get(`/subscription_info/${userId}`);
            setSubscriptionData(data);
            toast.success("Вы успешно отписались");
          } else {
            toast.error("Ошибка при отписке");
          }
        } catch (error) {
          toast.error("Произошла ошибка при отписке");
        }
      } else {
        toast.error("Подписка не найдена");
      }
    } catch (error) {
      toast.error("Произошла ошибка при отписке");
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCommentSubmit = async (postId, postUserId) => {
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
            : [...prevLikesData, { id: postId, user: user, post: { id: postId } }];
        });
      } else {
        toast.error("Что-то пошло не так");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Что-то пошло не так");
    }
  };

  return (
    <section className="flex flex-col mt-16">
      {userData && (
        <>
          <article className="flex ml-60">
            <div className=" flex flex-col gap-2 w-[178px]">
              {isAvatar && <img className="rounded-full w-[130px] h-[130px]" src={userData.avatar} alt="" />}
              {!isAvatar && (
                <div className="flex items-center justify-center p-4 bg-gray-300 rounded-full w-[130px] h-[130px]">
                  <img src="../../src/media/icons/user.png" alt="" className="w-[68px]" />
                </div>
              )}
            </div>
            <div className="flex flex-col ml-9 mt-5">
              <div className="flex items-center gap-10 mt-2 mb-2">
                <h2 className="font-bold font-roboto text-4xl mb-2">{userData.name}</h2>
                {!isOwner && (<>
                  {!isSubscribed && (
                    <button
                      className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-roboto font-weight-bolder text-xl"
                      onClick={handleSubscribeClick}>Подписаться
                    </button>
                  )}
                  {isSubscribed && (
                    <button
                      className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-roboto font-weight-bolder text-xl"
                      onClick={handleUnSubscribeClick}>Отписаться
                    </button>
                  )}
                </>)}
              </div>
              <p className="font-semibold font-roboto text-3xl">Подписчиков: {subscriptionData.subscriptions_count}</p>
              {userOnlineStatus && (
                <>
                  {userOnlineStatus === "Онлайн" ?
                    <div className="flex align-content-center items-center gap-1">
                      <p className="text-2xl text-green-700">◉</p>
                      <p className="font-semibold font-roboto text-2xl text-green-700">{userOnlineStatus}</p>
                    </div> :
                    <p className="font-semibold font-roboto text-2xl">{userOnlineStatus}</p>
                  }
                </>
              )}
              {isBio && <p className="font-semibold font-roboto text-2xl">{userData.bio}</p>}
              {!isBio && <p className="font-roboto font-semibold text-2xl">Информация отсутствует</p>}
              <p className="font-semibold font-roboto text-2xl">Дата
                рождения: {new Date(userData.birthday).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              <p
                className="font-semibold font-roboto text-2xl">Пол: {userData.gender === 'female' ? 'Женский' : 'Мужской'}</p>
            </div>
          </article>
          <article className="border-b mt-5 mb-5"></article>
          <article className="flex justify-between ">
            <div className="flex flex-wrap gap-20 mt-10 ml-10">
              {postsData.map(post => (
                <div key={post.id} onClick={() => handlePostClick(post)}>
                  <UserProfilePost post={post}/>
                </div>
              ))}
            </div>
          </article>
          {selectedPost && (
            <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center" onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPost(null);
              }
            }}>
              <div className="max-w-screen-lg mx-auto mt-6 max-h-screen overflow-y-auto">
                <Post post={selectedPost} onLikeClick={handleLikeClick} likesData={likesData} user={user}
                      comments={comments} handleCommentSubmit={handleCommentSubmit} setNewCommentText={setNewCommentText}
                      newCommentText={newCommentText}/>
              </div>
            </div>
          )}
        </>
      )}
      <Toaster/>
    </section>
  );
}
