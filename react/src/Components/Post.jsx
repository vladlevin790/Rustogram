import React, { useState } from 'react';
import Burger from "./Burger.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BookMarkIcon from "./BookMarkIcon.jsx";
import PaperPlaneIcon from "./PaperPlaneIcon.jsx";
import CommentIcon from "./CommentIcon.jsx";
import LikeIcon from "./LikeIcon.jsx";
import PostComments from "./PostComments.jsx";

export default function Post({ post, onLikeClick, likesData, user }) {
  const isImage = post.image_path !== null;
  const isVideo = post.video_path !== null;
  const isAvatar = post.user.avatar !== null;
  const [isComment, setIsComment] = useState(false);

  const [isLiked, setIsLiked] = useState(false);

  const isLikedByUser = likesData.some(
    like => like?.post?.id === post.id && like?.user?.id === user?.id
  );

  const handleLikeButtonClick = () => {
    setIsLiked(!isLiked);
    onLikeClick(post.id);
  };

  function formatLikesWord(count) {
    const cases = [2, 0, 1, 1, 1, 2];
    return ['лайк', 'лайка', 'лайков'][count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];
  }

  return (
    <div className="flex flex-col w-[770px]  bg-[#F9F8F8] border border-gray-300 rounded-md shadow-md mb-4 relative">
      {isImage && <img src={post.image_path} alt={post.altText} className="rounded-md mb-2 h-[691px]" />}
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
                {isAvatar ? <img src={post.user.avatar} alt="" /> : <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]" />}
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
          {isAvatar ? <img src={post.user.avatar} alt="" /> : <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]" />}
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
    </div>
  );
}
