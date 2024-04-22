import axiosClient from "../axios-client.js";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function InsertUpdateUser() {
  const birthdayRef = createRef();
  const avatarRef = createRef();
  const genderRef = createRef();
  const bioRef = createRef();
  const { setUser, setToken } = useStateContext();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const submitAdditionalInfo = (ev) => {
    ev.preventDefault();
    const birthday = new Date(birthdayRef.current.value);
    const formattedBirthday = birthday.toISOString().split('T')[0];

    const formData = new FormData();
    formData.append('birthday', formattedBirthday);
    formData.append('avatar', avatarRef.current.files[0]);
    formData.append('gender', genderRef.current.value);
    formData.append('bio', bioRef.current.value);

    axiosClient.post('/signup/finish', formData, { withCredentials: true })
      .then(() => {
        toast("Данные успешно сохранены", {
          style: {
            background: "#ABF3B3",
            fontFamily: "Roboto",
            fontSize: '20px',
            color: 'white'
          }
        });
      })
      .catch(error => {
        toast("Что-то пошло не так", {
          style: {
            background: "#FDA0A0",
            fontFamily: "Roboto",
            fontSize: '20px',
            color: 'white'
          }
        });
      });

    axiosClient.get('/user_main').then(({ data }) => {
      setUser(data);
      navigate('/user_main');
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  return (
    <div className="flex w-[1300px] justify-center items-center h-screen">
      <form onSubmit={submitAdditionalInfo} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex flex-col gap-2  mb-4 justify-center items-center">
          <h2 className="font-rustogram text-4xl">Rustogram</h2>
          <p className="font-roboto">Завершите регистрацию</p>
        </div>
        <div className="mb-4 font-roboto">
          <label className="block text-gray-700  text-sm font-bold mb-2" htmlFor="birthday">
            Дата рождения
          </label>
          <input type="date" id="birthday" name="birthday" ref={birthdayRef} required
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4 font-roboto relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
            Аватар
          </label>
          <div className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-3">
            <input type="file" accept=".png, .jpg, .jpeg, .gif" ref={avatarRef} onChange={handleAvatarChange}
                   className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"/>
            <span className="text-gray-700">Выберите файл</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          {avatarPreview && (
            <img src={avatarPreview} alt="Avatar Preview" className="mt-2 rounded-md" style={{ maxWidth: "100px" }} />
          )}
        </div>
        <div className="mb-4 font-roboto">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Биография
          </label>
          <input type="text" placeholder="Биография" ref={bioRef}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4 font-roboto">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
            Пол
          </label>
          <select ref={genderRef}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-roboto">
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>
        <div className="flex items-center justify-center font-roboto">
          <button type="submit"
                  className="bg-red-400 w-[257px] h-[49px] text-white py-3 text-lg rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-green-500">
            Завершить регистрацию
          </button>
        </div>
        <Toaster/>
      </form>
    </div>
  );
}
