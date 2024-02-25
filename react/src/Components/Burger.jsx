import {twMerge} from "tailwind-merge";

export default function Burger({className}){
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 36 38'
      width='36'
      height='38'
      className={twMerge('w-20 h-20', className)}
    >
      <g>
        <path d="M22 0H0V2.2H22V0Z" fill="black"/>
        <path d="M22 9.90002H0V12.1H22V9.90002Z" fill="black"/>
        <path d="M22 19.8H0V22H22V19.8Z" fill="black"/>
      </g>
    </svg>
  )
}
