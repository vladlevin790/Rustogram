import React, {useRef, useState} from 'react';
import Burger from "./Burger.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BookMarkIcon from "./BookMarkIcon.jsx";
import PaperPlaneIcon from "./PaperPlaneIcon.jsx";
import CommentIcon from "./CommentIcon.jsx";
import LikeIcon from "./LikeIcon.jsx";
import PostComments from "./PostComments.jsx";
import axiosClient from "../axios-client.js";
import toast from "react-hot-toast";

export default function Post({ post, onLikeClick, likesData, user, isOwner, updatePostsList, updatePostDescription }) {
  const isImage = post.image_path !== null;
  const isVideo = post.video_path !== null;
  const isAvatar = post.user.avatar !== null;
  const [isComment, setIsComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [postEdit, setPostEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  let bioRef = useRef();
  const isLikedByUser = likesData.some(
    like => like?.post?.id === post.id && like?.user?.id === user?.id
  );

  const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        axiosClient.put(`/posts/${post.id}/${bioRef.current.value}`);
        updatePostDescription(post.id, bioRef.current.value);
        toast("Вы успешно описание поста",{style:{background:"#71D87B", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
      } catch (error) {
        toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
      }
  }

  const handleEditImageSubmit = async (e) => {
    e.preventDefault();
  }

  const handleDeletePost = async () => {
    try {
      await axiosClient.delete(`/posts/${post.id}`);
      updatePostsList(post.id);
      toast("Вы успешно удалили пост",{style:{background:"#71D87B", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  const handleImageChange = () => {

  }

  const handleDeleteImage = () => {

  }

  const handleLikeButtonClick = () => {
    setIsLiked(!isLiked);
    onLikeClick(post.id);
  };

  function formatLikesWord(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['лайк', 'лайка', 'лайков'][count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];
  }

  return (
    <article className="flex flex-col w-[770px]  bg-[#F9F8F8] border border-gray-300 rounded-md shadow-md mb-4 relative">
      {isOwner && (<button className="absolute top-6 right-0 flex items-center font-semibold h-8 p-5 rounded" onClick={() => {
        setPostEdit(!postEdit);
      }}><Burger className="w-10 mt-2"/></button>)}
      {!postEdit &&(<>
      {isImage && <img src={post.image_path} alt={post.altText} className="rounded-md mb-2 h-[691px]"/>}
      {isVideo && (
        <div className="relative mb-2">
        <video src={post.video_path} alt={post.altText} className="rounded-md w-full h-[691px]" controls></video>
        </div>
      )}
      <div className="flex flex-col items-center w-full">
        {isComment ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-between ml-2 w-[740px] mt-5">
              <Link to="/user_profile" className="flex items-center gap-2 w-full ml-6">
                <div className="flex  items-center justify-center p-4 bg-gray-300 rounded-full w-[37px] h-[39px]">
                  {!isAvatar && (<img src="../../src/media/icons/user.png" alt="" className="w-[68px]" />)}
                  {isAvatar && (<img src={user.avatar} alt="" />)}
                </div>
                <h2 className="font-semibold text-[30px] font-roboto">{post.user.name}</h2>
              </Link>
              <div className="flex items-center w-[200px] font-semibold text-[20px]">
                <h2>{post.likes} {formatLikesWord(post.likes)}</h2>
              </div>
            </div>
            <h2 className="font-semibold mb-5">Комментарии</h2>
            <PostComments post={post} isComment={isComment} setIsComment={setIsComment} />
          </div>
        ) : (
          <div className="flex justify-between w-[740px]">
            <div className="flex gap-2 relative">
              <motion.div
                className={`w-30 cursor-pointer ${isLikedByUser ? 'fill-red-400 fill' : ''}`}
                whileTap={{ scale: 1.2 }}
                onClick={handleLikeButtonClick}
              >
                <LikeIcon className={`w-30 h-full ${isLiked ? 'animate-like' : ''}`} />
              </motion.div>
              {isLiked && (
                <div className="absolute inset-0 bg-red-400 rounded-full pointer-events-none z-0" style={{ zIndex: -1 }} />
              )}
              <motion.div className={`w-30 cursor-pointer`}
                          whileTap={{ scale: 1.2 }}
                          onClick={() => setIsComment(!isComment)}>
                <CommentIcon className="w-30 hover:fill-gray-400 transition cursor-pointer" />
              </motion.div>
              <PaperPlaneIcon className="w-30 hover:fill-gray-400 transition cursor-pointer" />
            </div>
            <BookMarkIcon className="w-47 hover:fill-amber-300 transition cursor-pointer" />
          </div>
        )}
        {!isComment && (<Link to="/user_profile" className="flex items-center gap-2 w-full ml-6">
          {isAvatar ? <img className="w-[50px] h-[50px] rounded-full" src={post.user.avatar} alt="" /> : <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]" />}
          <h2 className="font-semibold text-[30px] font-roboto">{post.user.name}</h2>
        </Link>)}
        {!isComment && (<div className="flex mt-5 w-full ml-8 font-semibold text-[20px]">
          <h2>{post.likes} {formatLikesWord(post.likes)}</h2>
        </div>)}
        <div className="w-full flex items-center cursor-pointer">
          <Burger className="w-6 ml-4 mt-3" />
          <h2 className="font-bold" onClick={() => setIsComment(!isComment)}>
            {isComment ? "Скрыть комментарии" : "Открыть комментарии"}
          </h2>
        </div>
      </div>
      </>)}
      {postEdit && (
        <>
          {isImage && <img src={post.image_path} alt={post.altText} className="rounded-md mb-2 h-[691px] w-[770px]"/>}
          {isVideo && (
            <div className="relative mb-2">
              <video src={post.video_path} alt={post.altText} className="rounded-md w-full h-[691px] w-[770px]" controls></video>
            </div>
          )}
          <form onSubmit={handleEditSubmit} className="p-4">
            <div className="mb-2">
              <label htmlFor="description" className="block font-semibold mb-1">Описание:</label>
              <input type="text" id="description" ref={bioRef}  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" placeholder={`${post.description}`}/>
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Сохранить</button>
              <button type="button" onClick={() => setPostEdit(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Отмена</button>
            </div>
          </form>
          <form onSubmit={handleEditImageSubmit} className="p-4">
            <div className="mb-2">
              <label htmlFor="image" className="block font-semibold mb-1">Добавить/изменить картинку:</label>
              <input type="file" id="image" onChange={handleImageChange}
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"/>
              {imagePreview && (
                <div className="mb-2">
                  <h3 className="font-semibold mb-1">Предпросмотр:</h3>
                  <img src={imagePreview} alt="Предпросмотр" className="w-40 h-40 object-cover rounded-md border border-gray-300" />
                </div>
              )}
              <button type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Сохранить
              </button>
            </div>
          </form>
          <button onClick={handleDeletePost}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Удалить пост
          </button>
        </>
      )}
    </article>
  );
}
