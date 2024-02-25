import React, { useState } from 'react';
import axios from 'axios';
import axiosClient from "../axios-client.js";

export default function CreationPost() {
  const [postData, setPostData] = useState({
    image_path: '',
    video_path: '',
    description: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const { name } = e.target;
      setPostData({ ...postData, [name]: file });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('image_path', postData.image_path);
      formData.append('video_path', postData.video_path);
      formData.append('description', postData.description);

      const response = await axiosClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        },
      });

      console.log('Post created:', response.data);

      setPostData({
        image_path: '',
        video_path: '',
        description: '',
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Image Path:
          <input
            type="file"
            name="image_path"
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
          />
        </label>
        <br />
        <label>
          Video Path:
          <input
            type="file"
            name="video_path"
            accept=".mp4, .mov"
            onChange={handleFileChange}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={postData.description}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Create Post</button>
      </form>
    </>
  );
}
