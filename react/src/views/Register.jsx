import {createRef, useState} from 'react';
import Lottie from "react-lottie-player";
import lottieJson from "../media/gifs/Animation - 1702897743165.json";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import toast from "react-hot-toast";
import {UserInput} from "../hooks/UserInput.jsx";

export default function Register(){
  const email = UserInput("",{emptyInput:true, minLength:4 , emailError: true})
  const password = UserInput("", {emptyInput:true, minLength:7})
  const username = UserInput("", {emptyInput:true, minLength: 2})
  const passwordCheck = UserInput("", {emptyInput:true})

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
        toast("Вы зарегистрировали аккаунт!",{style:{background:"#ABF3B3", fontFamily:"Roboto", fontSize:'20px', color:'white'}});
      })
      .catch(err => {
        toast("Проверьте ваши данные",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
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
        <div className="relative flex flex-col gap-4 w-[430px] bg-gray-200  py-[34px] px-[37px] rounded-lg items-center">
          {username.isDirty && (
            <div className="absolute top-2 font-roboto text-l">
              {username.emptyInput && "Поле не может быть пустым"}
              {!username.emptyInput && username.minLength && "Имя слишком короткое"}
            </div>
          )}
          <input  onChange={e => username.onChange(e)}
                  onBlur={e => username.onBlur(e)}
                  value={username.value}
                  type="text"
                  ref={nameRef}
                  placeholder="Имя пользователя"
                  className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          {email.isDirty && (
            <div className="absolute top-[21.5%] font-roboto text-l">
              {email.emptyInput && "Поле не может быть пустым"}
              {!email.emptyInput && email.minLength && "Email слишком короткий"}
              {!email.emptyInput && !email.minLength && email.emailError && "Это не электронная почта"}
            </div>
          )}
          <input onChange={e => email.onChange(e)}
                 onBlur={e => email.onBlur(e)}
                 value={email.value}
                 type="email"
                 ref={emailRef}
                 placeholder="Электронная почта"
                 className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          {password.isDirty && (
            <div className="absolute top-[40%] font-roboto text-l">
              {password.emptyInput && "Поле не может быть пустым"}
              {!password.emptyInput && password.minLength && "Пароль слишком короткий"}
            </div>
          )}
          <input onChange={e => password.onChange(e)}
                 onBlur={e => password.onBlur(e)}
                 value={password.value}
                 type="password"
                 ref={passwordRef}
                 placeholder="Пароль"
                 className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  w-[351px] py-5 rounded-lg focus:outline-none focus:ring focus:border-blue-500"/>
          {passwordCheck.isDirty && (
            <div className="absolute top-[58.5%] font-roboto text-l">
              {passwordCheck.emptyInput && "Поле не может быть пустым"}
            </div>
          )}
          <input onChange={e => passwordCheck.onChange(e)}
                 onBlur={e => passwordCheck.onBlur(e)}
                 value={passwordCheck.value}
                 type="password"
                 ref={passwordConfirmationRef}
                 placeholder="Повторите пароль"
                 className="placeholder:text-black placeholder:text-mg p-4 border bg-gray-300  rounded-lg w-[351px] py-5  focus:outline-none focus:ring focus:border-blue-500"/>
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
