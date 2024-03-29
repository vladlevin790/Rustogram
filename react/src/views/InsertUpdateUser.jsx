import axiosClient from "../axios-client.js";
import {createRef} from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import toast, {Toaster} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function InsertUpdateUser(){
  const birthdayRef = createRef();
  const avatarRef = createRef();
  const genderRef = createRef();
  const bioRef = createRef();
  const { setUser, setToken } = useStateContext()
  const navigate = useNavigate();

  const submitAdditionalInfo = (ev) => {
    ev.preventDefault();
    const birthday = new Date(birthdayRef.current.value);
    const formattedBirthday = birthday.toISOString().split('T')[0];

    const payload = {
      birthday: formattedBirthday,
      avatar: avatarRef.current.value,
      gender: genderRef.current.value,
      bio: bioRef.current.value
    };

    axiosClient.post('/signup/finish', payload, { withCredentials: true })
      .then(()=>{toast("Данные успешно сохранены",{style:{background:"#ABF3B3", fontFamily:"Roboto", fontSize:'20px', color:'white'}})})
      .catch(error => {
        toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
      });
    axiosClient.get('/user_main').then(({data}) => {
      setUser(data);
      navigate('/user_main');
    })
  };

  return(
    <form onSubmit={submitAdditionalInfo}>
      <input type="date" id="birthday" name="birthday" ref={birthdayRef} required/>
      <input type="file" accept=".png, .jpg, .jpeg, .gif" ref={avatarRef}/>
      <input type="text" placeholder="Биография" ref={bioRef}/>
      <select ref={genderRef}>
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
      </select>
      <button type="submit" className="bg-red-400 w-[257px] h-[49px] text-white py-3 text-lg rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-green-500">Завершить регистрацию</button>
      <Toaster />
    </form>

  );
}

