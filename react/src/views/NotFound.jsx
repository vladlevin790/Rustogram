import {useState} from "react";
import {Navigate} from "react-router-dom";

export default function NotFound() {
    const [isRedirect, setIsRedirect] = useState(false);
    if (isRedirect) {
      return <Navigate to='/user_main'/>
    }
    return (
        <div className="relative flex justify-center items-center flex-col">
            <img src="../../src/media/gifs/levin-rustogram.gif" className="w-[800px]" alt=""/>
            <h2 className="absolute top-36 font-bold font-roboto text-4xl bg-blue-500 p-4 rounded-xl text-white">404 страница не найдена</h2>
            <p onClick={()=>setIsRedirect(!isRedirect)} className="font-roboto cursor-pointer font-thin text-2xl">Вернуться на главную</p>
        </div>
    )
}
