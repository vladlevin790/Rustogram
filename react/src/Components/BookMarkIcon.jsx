import {twMerge} from "tailwind-merge";

export default function BookMarkIcon({className}){
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'
        viewBox='0 0 48 56'
        width='48'
        height='56'
        className={twMerge('w-20 h-20', className)}
      >
        <g>
          <path
            d='M47.6939 55.5H42.6903L23.8481 42.3447L5.0344 55.5H0V0.5H47.6939V55.5ZM4.54227 4.16667V50.9931L23.8458 37.4952L43.1516 50.974V4.16667H4.54227Z'/>
        </g>
      </svg>
    )
}
