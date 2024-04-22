import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import Slider from "react-slick";

export default function Post({ post, onLikeClick, likesData, user, isOwner, updatePostsList, updatePostDescription, updatePostImagesOrVideosNumbered, comments, handleCommentSubmit, newCommentText, setNewCommentText }) {
  const isImage = post.image_path !== null;
  const isVideo = post.video_path !== null;
  const isAvatar = post.user.avatar !== null;
  const hasMoreImages = post.more_image_path && post.more_image_path.length > 0;
  const [isComment, setIsComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [postEdit, setPostEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);
  const bioRef = useRef(null);
  const urlName = `${post.user.id}`;

  const isLikedByUser = likesData.some(
    like => like?.post?.id === post.id && like?.user?.id === user?.id
  );

  const commentsPost = useMemo(() => {
    return comments.filter(comment => comment.post_id === post.id);
  }, [comments, post.id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      axiosClient.put(`/posts/${post.id}/${bioRef.current.value}`);
      updatePostDescription(post.id, bioRef.current.value);
      toast("Вы успешно изменили описание поста", { style: { background: "#71D87B", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    } catch (error) {
      toast("Что-то пошло не так", { style: { background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    }
  };

  const handleEditImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image_path', selectedImage);

      await axiosClient.post(`/posts/${post.id}/add_image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updatePostImagesOrVideosNumbered(post.id);
      setImagePreview(URL.createObjectURL(selectedImage));
      setSelectedImage(null);
    } catch (error) {

    }
  };

  const handleDeletePost = async () => {
    try {
      await axiosClient.delete(`/posts/${post.id}`);
      updatePostsList(post.id);
      toast("Вы успешно удалили пост", { style: { background: "#71D87B", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    } catch (error) {
      toast("Что-то пошло не так", { style: { background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white' } });
    }
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleLikeButtonClick = () => {
    setIsLiked(!isLiked);
    onLikeClick(post.id);
  };

  function formatLikesWord(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['лайк', 'лайка', 'лайков'][count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];
  }

  const handleNewCommentSubmit = () => {
    handleCommentSubmit(post.id, post.user.id, newCommentText, setNewCommentText);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <article className="flex static flex-col w-[770px] bg-[#F9F8F8] border border-gray-300 rounded-md shadow-md mb-4 relative font-roboto">
      {isOwner && (
        <button className="absolute top-6 right-2 p-2 bg-gray-50 flex items-center rounded-3xl h-14 opacity-45 z-10" onClick={() => {
          setPostEdit(!postEdit);
        }}>
          <Burger className="w-10 mt-4 ml-4" />
        </button>
      )}
      {!postEdit && (
        <>
          {(!hasMoreImages && (isImage || isVideo)) && (
            <div className="relative">
              {isVideo && (
                <video src={post.video_path} alt="Main Video" className="rounded-md mb-2 w-full h-[691px] object-cover" controls></video>
              )}
              {isImage && (
                <img src={post.image_path} alt="Main Image" className="object-cover rounded-md mb-2 h-[691px] w-full" />
              )}
            </div>
          )}
          {(hasMoreImages || (!isImage && !isVideo)) && (
            <Slider {...settings} ref={sliderRef}>
              {isVideo && (
                <div className="relative">
                  <video src={post.video_path} alt="Main Video" className="rounded-md mb-2 w-full h-[691px] object-cover" controls></video>
                </div>
              )}
              {isImage && (
                <div className="relative">
                  <img src={post.image_path} alt="Main Image" className="object-cover rounded-md mb-2 h-[691px] w-full" />
                </div>
              )}
              {hasMoreImages &&
                post.more_image_path.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Slide ${index}`} className="object-cover rounded-md mb-2 h-[691px] w-full" />
                  </div>
                ))}
            </Slider>
          )}
          <div className="flex flex-col items-center w-full">
            {isComment ? (
              <div className="flex flex-col items-center w-full">
                <div className="flex justify-between ml-2 w-[740px] mt-5">
                  <Link to={`/user_profile/${urlName}`} className="flex items-center gap-2 w-full ml-6">
                    {isAvatar ? <img className="w-[50px] h-[50px] rounded-full" src={post.user.avatar} alt="" /> : <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]" />}
                    <h2 className="font-semibold text-[30px] font-roboto">{post.user.name}</h2>
                  </Link>
                  <div className="flex flex-col items-center w-[200px] font-semibold font-roboto text-[20px]">
                    <h2>{post.likes} {formatLikesWord(post.likes)}</h2>
                    <h2 className="max-w-[150px] truncate hover:max-w-[200px]">{post.description}</h2>
                  </div>
                </div>
                <h2 className="font-semibold mb-5">Комментарии</h2>
                <PostComments postComments={commentsPost} />
                <div className="flex items-center font-roboto mb-2 justify-center gap-2">
                  <input
                    className="flex p-2 border border-gray-300 rounded-md w-[350px] "
                    value={newCommentText}
                    onChange={event => setNewCommentText(event.target.value)}
                    placeholder="Написать комментарий..."
                  />
                  <button
                    className="p-2 h-[40px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleNewCommentSubmit}
                    disabled={!newCommentText}
                  >
                    Отправить
                  </button>
                </div>
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
                  <motion.div className={`w-30 cursor-pointer`} whileTap={{ scale: 1.2 }} onClick={() => setIsComment(!isComment)}>
                    <CommentIcon className="w-30 hover:fill-gray-400 transition cursor-pointer" />
                  </motion.div>
                  <PaperPlaneIcon className="w-30 hover:fill-gray-400 transition cursor-pointer" />
                </div>
                <BookMarkIcon className="w-47 hover:fill-amber-300 transition cursor-pointer" />
              </div>
            )}
            {!isComment && (
              <Link to={`/user_profile/${urlName}`} className="flex items-center gap-2 w-full ml-6">
                {isAvatar ? <img className="w-[50px] h-[50px] rounded-full" src={post.user.avatar} alt="" /> : <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]" />}
                <h2 className="font-semibold text-[30px] font-roboto">{post.user.name}</h2>
              </Link>
            )}
            {!isComment && (
              <div className="flex flex-col mt-5 w-full ml-8 font-semibold text-[20px]">
                <h2>{post.likes} {formatLikesWord(post.likes)}</h2>
                <h2 className="max-w-[150px] truncate hover:max-w-[400px]">{post.description}</h2>
              </div>
            )}
            <div className="w-full flex items-center cursor-pointer">
              <Burger className="w-6 ml-4 mt-3" />
              <h2 className="font-bold" onClick={() => setIsComment(!isComment)}>
                {isComment ? "Скрыть комментарии" : "Открыть комментарии"}
              </h2>
            </div>
          </div>
        </>
      )}
      {postEdit && (
        <>
          {(isImage || isVideo) && (
            <div className="relative">
              {isVideo && (
                <video src={post.video_path} alt="Main Video" className="rounded-md mb-2 w-full h-[691px] object-cover" controls></video>
              )}
              {isImage && (
                <img src={post.image_path} alt="Main Image" className="object-cover rounded-md mb-2 h-[691px] w-full" />
              )}
            </div>
          )}
          <form onSubmit={handleEditSubmit} className="p-4">
            <div className="flex items-center gap-2">
              <div className="mb-2 w-full">
                <label htmlFor="description" className="block font-semibold mb-1">Описание:</label>
                <input type="text" id="description" ref={bioRef} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" defaultValue={post.description} />
              </div>
              <div className="flex justify-between items-center mt-5">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Сохранить</button>
              </div>
            </div>
          </form>
          <form onSubmit={handleEditImageSubmit} className="p-4">
            <div className="mb-2 flex gap-2">
              <div className="flex flex-col w-full">
                <label htmlFor="image" className="block font-semibold mb-1">Добавить картинку:</label>
                <input type="file" id="image" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none" />
              </div>
              {imagePreview && (
                <div className="mb-2">
                  <h3 className="font-semibold mb-1">Предпросмотр:</h3>
                  <img src={imagePreview} alt="Предпросмотр" className="w-40 h-40 object-cover rounded-md border border-gray-300" />
                </div>
              )}
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 h-10 mt-8">Сохранить</button>
            </div>
          </form>
          <div className="flex justify-around py-[10px]">
            <button type="button" onClick={() => setPostEdit(false)} className="w-[370px] px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Отмена</button>
            <button onClick={handleDeletePost} className="w-[370px] px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Удалить пост</button>
          </div>
        </>
      )}
    </article>
  );
}
