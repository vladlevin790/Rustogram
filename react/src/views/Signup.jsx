import {createRef, useState} from 'react';
import Lottie from "react-lottie-player";
import lottieJson from "../media/gifs/Animation - 1702897743165.json";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import axiosClient from "../axios-client.js";

export default function Register(){

  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()

  const {setUser,setToken} = useStateContext()
  const [message, setMessage] = useState(null)

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value
    }
    console.log(payload)
    axiosClient.post('/signup', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(err => {
        const response = err.response
        if(response && response.status === 422){
        }
        console.log(response)
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
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-lg w-[600px] h-[709px]">
        <h1 className="text-3xl font-bold mb-4 font-rustogram  mt-5 italic ">Rustogram</h1>
        <p className="text-gray-600 text-xl font-semibold">Регистрация</p>
        <div className="flex flex-col gap-4 w-[430px] bg-gray-200  py-[34px] px-[37px] rounded-lg items-center">
          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }
          <input type="text" ref={nameRef} placeholder="Имя пользователя" className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          <input type="email" ref={emailRef} placeholder="Электронная почта" className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          <input type="password" ref={passwordRef} placeholder="Пароль" className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          <input type="password" ref={passwordConfirmationRef} placeholder="Повторите пароль" className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  rounded-lg w-[351px] py-5  focus:outline-none focus:ring focus:border-blue-500"/>
          <button className="bg-red-400 w-[257px] h-[49px] text-white py-3 text-lg rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-green-500">Регистрация</button>
        </div>
        <div className="flex gap-4 border rounded-lg bg-gray-200 p-6 w-[430px] rounded items-center justify-center text-lg">
          <p className="text-gray-600 font-bold">Есть аккаунт?</p>
          <Link to="/login" className="text-blue-500 hover:underline">Войти</Link>
        </div>
      </form>
    </div>
  )
}
