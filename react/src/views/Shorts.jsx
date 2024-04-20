import React, { useState, useEffect, useRef } from 'react';
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import { Link } from "react-router-dom";
import UserIcon from "../Components/UserIcon.jsx";
import toast from "react-hot-toast";
import LikeIcon from "../Components/LikeIcon.jsx";
import { motion } from "framer-motion";
import CommentIcon from "../Components/CommentIcon.jsx";
import PaperPlaneIcon from "../Components/PaperPlaneIcon.jsx";
import { Scrollbars } from "react-custom-scrollbars";

export default function Shorts() {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [shortsList, setShortsList] = useState([]);
  const [mode, setMode] = useState('view');
  const { user } = useStateContext();
  const isAvatar = user.avatar !== null;
  const [likesData, setLikesData] = useState([]);
  const [commentOpenId, setCommentOpenId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentsOpen, setCommentsOpen] = useState(false);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      setMessage('Please select a video file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('video_path', video);
      formData.append('description', description);
      formData.append('user_id', user.id);

      const response = await axiosClient.post('/create_shorts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
        }
      });

      setMessage('Short video created successfully.');
      setShortsList([...shortsList, response.data]);
      setVideo(null);
      setDescription('');
      fetchShorts();
    } catch (error) {
      setMessage('Failed to create short video.');
      console.error(error);
    }
  };

  const fetchShorts = async () => {
    try {
      const response = await axiosClient.get('/get_shorts');
      setShortsList(response.data);
      const likesResponse = await axiosClient.get('/get_shorts_likes');
      setLikesData(likesResponse.data.likes);
      const commentsResponse = await Promise.all(response.data.map(shorts => axiosClient.get(`/reels/${shorts.id}/comments`)));
      const commentsData = {};
      commentsResponse.forEach((response, index) => {
        commentsData[shortsList[index].id] = response.data;
      });
      setComments(commentsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeClick = async (reelsId) => {
    try {
      const hasLiked = likesData.some(like => like.reels && like.reels.id === reelsId && like.user.id === user.id);
      const endpoint = hasLiked ? '/unlike_shorts' : '/like_shorts';
      await axiosClient.post(endpoint, { reels_id: reelsId });
      const updatedLikesData = hasLiked
        ? likesData.filter(like => !(like.reels && like.reels.id === reelsId && like.user.id === user.id))
        : [...likesData, { id: reelsId, user: user, reels: { id: reelsId } }];
      setLikesData(updatedLikesData);
    } catch (error) {
      toast("Something went wrong", { style: { background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    }
  };

  const createComment = async (reelsId, commentText) => {
    try {
      const response = await axiosClient.post(`/reels/${reelsId}/comments`, {
        user_id: user.id,
        reels_id: reelsId,
        content: commentText,
      });
      const responseGet = await axiosClient.get(`/reels/${reelsId}/comments`);
      setComments({ ...comments, [reelsId]: responseGet.data });
      setCommentOpenId(reelsId);
      setDescription('');
      return responseGet.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  };


  useEffect(() => {
    fetchShorts();
  }, []);

  const toggleMode = () => {
    setMode(mode === 'create' ? 'view' : 'create');
  };

  const handleCommentClick = async (shortsId) => {
    if (commentOpenId === shortsId) {
      setCommentOpenId(null);
    } else {
      try {
        const response = await axiosClient.get(`/reels/${shortsId}/comments`);
        setComments({ ...comments, [shortsId]: response.data });
        setCommentOpenId(shortsId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollbarsRef = useRef(null);

  const handleScrollStart = () => {
    setIsScrolling(true);
  };

  const handleScrollStop = () => {
    setIsScrolling(false);
  };

  const handleWheel = (e) => {
    if (isScrolling) {
      e.stopPropagation();
    }
  };

  const getFormattedTime = (comment) => {
    const timestamp = new Date(comment.created_at);
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

  const getMinutesSuffix = (minutes) => {
    if (minutes === 1) {
      return 'у';
    } else if (minutes >= 2 && minutes <= 4) {
      return 'ы';
    } else {
      return '';
    }
  };

  const getHoursSuffix = (hours) => {
    if (hours === 1) {
      return '';
    } else {
      return 'а';
    }
  };

  const getDaysSuffix = (days) => {
    if (days === 1) {
      return 'ень';
    } else if (days >= 2 && days <= 4) {
      return 'ня';
    } else {
      return 'ней';
    }
  };

  const formatLikesCount = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${count} лайков`;
    }

    if (lastDigit === 1) {
      return `${count} лайк`;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} лайка`;
    }

    return `${count} лайков`;
  };

  const handleDeleteShorts = (shortsId) => {
    try {
      axiosClient.delete(`/delete_shorts/${shortsId}`,{
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
        }
      });
      fetchShorts();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <button onClick={toggleMode} className="fixed bottom-5 right-10 bg-blue-400 text-white rounded-xl p-4">{mode === 'create' ? 'Смотреть' : 'Создать'}</button>
      {mode === 'create' && (
        <div className="flex flex-col items-center justify-center mt-5 gap-4 w-[1300px] h-screen">
          <div className="bg-gray-200 p-8 flex flex-col items-center rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-4">Создать шортс</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center">
                <label htmlFor="fileInput" className="relative cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <span>Выбрать видео</span>
                  <input
                    type="file"
                    accept="video/mp4,video/hevc"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                </label>
              </div>
              {video && (
                <div className="mt-4 w-[300px] h-[400px] mb-40">
                  <video controls className="w-full">
                    <source src={URL.createObjectURL(video)} type="video/mp4" />
                    Ваш браузер не поддерживает видео.
                  </video>
                </div>
              )}
              <textarea
                placeholder="Описание"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full max-w-md h-24 px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Создать шорт
              </button>
            </form>
          </div>
        </div>
      )}

      {mode === 'view' && (
        <div className="flex flex-col items-center mt-5 justify-center gap-4 w-[1300px]">
          {shortsList.map(shorts => (
            <div key={shorts.id} className="relative border border-gray-200 w-[500px] rounded-xl">
              <Player playsInline
                      loop={true}
                      src={shorts.video_path}
              />
              <div className="absolute bottom-10 left-5 text-white font-roboto z-20">
                <Link to={`/user_profile/${shorts.user_id}`} className="flex items-center gap-2 w-full">
                  {isAvatar ? <img className="w-[50px] h-[50px] rounded-full" src={shorts.user.avatar} alt="" /> : <UserIcon className="h-[39px] w-[37px] fill-white" />}
                  <h2 className="font-semibold text-[30px] font-roboto">{shorts.user.name}</h2>
                </Link>
                <p className="text-2xl mt-2 font-roboto">{shorts.description}</p>
                <div>
                  <span className="font-roboto">{formatLikesCount(likesData.filter(like => like.reels && like.reels.id === shorts.id).length)}</span>
                </div>
                {commentOpenId === shorts.id && commentsOpen && (
                  <div className="w-[400px]">
                    <Scrollbars
                      style={{ width: '100%', height: 400 }}
                      ref={scrollbarsRef}
                      onFocus={handleScrollStart}
                      onBlur={handleScrollStop}
                      onWheel={handleWheel}
                    >
                      <div className="flex flex-col items-center w-full p-4">
                        {comments[shorts.id] && comments[shorts.id].map(comment => (
                          <div key={comment.id} className="flex items-center mb-4 rounded w-full bg-comment p-4 justify-between">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                {!isAvatar && (
                                  <img className="w-[37px] h-[39px]" src="../../src/media/icons/user.png" alt=""/>)}
                                {isAvatar && (
                                  <img className="w-[40px] h-[40px] rounded-full" src={comment.user.avatar} alt=""/>)}
                              </div>
                              <div className="ml-4 font-roboto">
                                <h2 className="text-sm font-bold text-gray-900">{comment.user.name}</h2>
                                <p className="text-sm text-gray-500 ">{getFormattedTime(comment)}</p>
                              </div>
                            </div>
                            <p className="text-sm max-w-[100px] overflow-hidden overflow-ellipsis">
                              <span
                                className="whitespace-normal break-words font-semibold font-roboto mr-5 text-xl text-black">{comment.content}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </Scrollbars>
                    <div className="flex gap-4 mt-10">
                      <textarea
                        value={description}
                        placeholder="Ваш комментарий"
                        onChange={e => setDescription(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-[300px] focus:outline-none focus:border-blue-500 text-black font-roboto resize-none"
                      />
                      <button onClick={() => createComment(shorts.id, description)} className="p-2 h-[70px] bg-blue-500 text-white rounded-md hover:bg-blue-600">Отправить</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute flex flex-col justify-center items-center right-2 gap-4 top-[45%] z-10">
              <button onClick={() => handleLikeClick(shorts.id)}>
                  <motion.div
                    className={`w-30 cursor-pointer ${likesData.some(like => like.reels && like.reels.id === shorts.id && like.user.id === user.id) ? 'fill-red-400 fill' : 'fill-white'}`}
                    whileTap={{scale: 1.2}}
                    onClick={handleLikeClick}
                  >
                    <LikeIcon
                      className={`w-30 h-full ${likesData.some(like => like.reels && like.reels.id === shorts.id && like.user.id === user.id) ? 'animate-like' : ''}`}/>
                  </motion.div>
                </button>
                <button>
                  <motion.div
                    className={`w-30 cursor-pointer`}
                    whileTap={{scale: 1.2}}
                    onClick={() => {
                      handleCommentClick(shorts.id);
                      setCommentsOpen(!commentsOpen);
                    }}
                  >
                    <CommentIcon className="w-30 hover:fill-gray-400 transition cursor-pointer fill-white"/>
                  </motion.div>

                </button>
                <button>
                  <PaperPlaneIcon className="w-30 hover:fill-gray-400 transition cursor-pointer fill-white"/>
                </button>
                {(shorts.user_id === user.id || user.is_admin === 1) && (
                  <button onClick={() => handleDeleteShorts(shorts.id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
