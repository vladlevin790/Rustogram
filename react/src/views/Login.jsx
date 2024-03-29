import {Link} from "react-router-dom";
import Lottie from 'react-lottie-player';
import lottieJson from '../media/gifs/Animation - 1702897743165.json';
import {createRef, useState} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import toast, {Toaster} from "react-hot-toast";

export default function Login(){
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)
  const onSubmit = ev => {

    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload, {withCredentials:true})
      .then(({data}) => {
        setUser(data.original.user)
        setToken(data.original.token);
        toast("Вы вошли в аккаунт!",{style:{background:"#ABF3B3", fontFamily:"Roboto", fontSize:'20px', color:'white'}});
      })
      .catch((err) => {
        toast("Проверьте свои данные",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}});
      })
  }
  return(
    <div className="flex justify-center items-center h-screen gap-8 font-roboto">
      <Lottie
        loop
        animationData={lottieJson}
        play
        className="w-[700px]"
      />
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-lg w-[600px] h-[657px]">
        <h1 className="text-3xl font-bold mb-4 font-rustogram font-semibold mt-5">Rustogram</h1>
        <p className="text-gray-600 text-xl font-semibold">Авторизация</p>
        <div className="flex flex-col gap-10 w-[430px] bg-gray-200 py-[64px] h-[349px] px-[37px] rounded-lg items-center">
          <input type="email" ref={emailRef} placeholder="Электронная почта" className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          <input type="password" ref={passwordRef} placeholder="Пароль" className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  rounded-lg w-[351px] py-5  focus:outline-none focus:ring focus:border-blue-500"/>
          <button className="bg-green-400 w-[149px] h-[49px] text-white py-3 text-lg rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-500">Войти</button>
        </div>
        <div className="flex gap-4 border rounded-lg bg-gray-200 p-6 w-[430px] rounded items-center justify-center text-lg">
          <p className="text-gray-600 font-bold">Нет аккаунта?</p>
          <Link to="/signup" className="text-blue-500 hover:underline">Зарегистрироваться</Link>
        </div>
      </form>
      <Toaster/>
    </div>
  )
}
