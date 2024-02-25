import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import Comment from './Comment';

export default function PostComments({ post }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');// Используем массив для хранения всех комментариев

  useEffect( () => {
    async function fetchData() {
      try {
        const response = await axiosClient.get(`/posts/${post.id}/comments`);
        setComments(response.data); // Устанавливаем все комментарии для текущего поста
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }

    fetchData();
  }, [post.id]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axiosClient.post(`/posts/${post.id}/comments`, {
        user_id: post.user.id,
        post_id: post.id,
        content: newCommentText,
      });

      const responseAgainst = await axiosClient.get(`/posts/${post.id}/comments`);

      setComments([...comments, response.data]);
      console.log(comments)
      setNewCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const postComments = comments.filter(comment => comment.post_id === post.id);

  return (
    <div className="flex flex-col w-full">
      {postComments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <div className="flex items-center mb-4">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm"
          value={newCommentText}
          onChange={event => setNewCommentText(event.target.value)}
          placeholder="Написать комментарий..."
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleCommentSubmit}
          disabled={!newCommentText}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
