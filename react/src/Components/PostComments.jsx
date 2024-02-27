import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import Comment from './Comment';

export default function PostComments({ post }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false); // Локальное состояние для отображения всех комментариев

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

  // Фильтрация комментариев в зависимости от состояния showAllComments
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="flex flex-col w-full" >
      {displayedComments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {comments.length > 3 && !showAllComments && (
        <button onClick={() => setShowAllComments(true)}>Показать все</button>
      )}
      <div className="flex items-center justify-center mb-4 gap-2">
        <input
          className="flex  p-2 border border-gray-300 rounded-md"
          value={newCommentText}
          onChange={event => setNewCommentText(event.target.value)}
          placeholder="Написать комментарий..."
        />
        <button
          className="p-[10px] bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleCommentSubmit}
          disabled={!newCommentText}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
