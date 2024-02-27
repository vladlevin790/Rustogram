import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import Comment from './Comment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function PostComments({ post }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  async function fetchData() {
    try {
      const response = await axiosClient.get(`/posts/${post.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [post.id]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axiosClient.post(`/posts/${post.id}/comments`, {
        user_id: post.user.id,
        post_id: post.id,
        content: newCommentText,
      });
      const updatedComments = await axiosClient.get(`/posts/${post.id}/comments`);
      setComments(updatedComments.data);
      setNewCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const settings = {
    infinite: true,
    centerPadding: "60px",
    padding: "20px",
    slidesToShow: 2,
    speed: 500,
    rows: 2,
    slidesPerRow: 2,
  };

  const postComments = comments.filter(comment => comment.post_id === post.id);

  return (
    <div className="flex flex-col w-full">
      <Slider {...settings} className="mb-8 ml-3">
        {postComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Slider>

      <div className="flex items-center mb-2 justify-center gap-2">
        <input
          className="flex p-2 border border-gray-300 rounded-md w-[350px] "
          value={newCommentText}
          onChange={event => setNewCommentText(event.target.value)}
          placeholder="Написать комментарий..."
        />
        <button
          className="p-2 h-[40px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleCommentSubmit}
          disabled={!newCommentText}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
