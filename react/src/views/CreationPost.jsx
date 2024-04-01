import React, { useState } from 'react';
import axiosClient from "../axios-client.js";
import toast, {Toaster} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function CreationPost() {
  const [postData, setPostData] = useState({
    image_path: '',
    video_path: '',
    description: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const { name } = e.target;
      setPostData({ ...postData, [name]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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

      await axiosClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        },
      });

      setPostData({
        image_path: '',
        video_path: '',
        description: '',
      });
      setPreviewImage(null);
      toast("Фотография добавлена",{style:{background:"#71D87B", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
      navigate('/profile');
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  const handleSelect = () => {
    setIsSelect(!isSelect);
  }

  return (
    <section className="flex flex-col items-center justify-center ml-[50%] h-screen">
      {isSelect &&(<>
        <form onSubmit={handleSubmit} className="flex flex-col  bg-gray-200 w-[770px] h-[736px] rounded-xl">
          {previewImage && (
            <div className="w-[770px] h-[517px] bg-gray-200 flex items-center justify-center mb-4 rounded-xl">
              <img src={previewImage} alt="Preview" className="w-full h-full rounded-t-xl" />
            </div>
          )}
          {!previewImage&& (<>
          <div className="flex items-center justify-center w-[770px] h-[736px] gap-4">
          {!previewImage && (
            <label htmlFor="image_path" className="mb-2">
              <input
                type="file"
                name="image_path"
                id="image_path"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <button type="button" className="bg-green-500 text-white py-2 px-4 rounded-md" onClick={() => document.getElementById('image_path').click()}>Выбрать картинку</button>
            </label>
          )}
          {!previewImage && (
            <label htmlFor="video_path" className="mb-2">
              <input
                type="file"
                name="video_path"
                id="video_path"
                accept=".mp4, .mov"
                onChange={handleFileChange}
                className="hidden"
              />
              <button type="button" className="bg-green-500 text-white py-2 px-4 rounded-md" onClick={() => document.getElementById('video_path').click()}>Выбрать видео</button>
            </label>
          )}
          </div>
          </>)}
          {previewImage &&(<>
          <div className="flex items-center gap-4">
            <label htmlFor="description" className="mb-2 gap-3 flex flex-col font-roboto font-bold text-3xl w-[550px] ml-8">
              Описание:
              <textarea
                name="description"
                id="description"
                value={postData.description}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 resize-none placeholder:font-thin placeholder:text-[25px] h-[120px]"
                placeholder="Придумайте и напишите описание к своему посту"
              />
            </label>
            <button type="submit" className="bg-[#B6F8B0] font-roboto font-bold rounded-md w-[105px] h-[120px] mt-10">Выложить</button>
          </div>
          </>)}
        </form>
      </>)}
      {!isSelect &&(<>
        <article className="flex bg-gray-200 justify-center items-center w-[770px] h-[736px] rounded-xl">
          <button className="w-[430px] h-[114px] bg-[#B1E3B0] rounded font-roboto text-[25px] font-weight-bolder" onClick={handleSelect}>Выбрать контент</button>
        </article>
      </>)}
      <Toaster/>
    </section>
  );
}
