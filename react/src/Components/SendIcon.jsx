import { twMerge } from "tailwind-merge";

export default function SendIcon({ className }) {
  return (
    <svg
      width="37"
      height="31"
      viewBox="0 0 37 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("w-10 h-20", className)}
    >
      <path
        d="M8.38646 15.5H16.7115M14.661 5.46374L27.8577 10.9921C33.7777 13.4721 33.7777 17.5279 27.8577 20.0079L14.661 25.5362C5.78105 29.2562 2.15813 26.2079 6.59813 18.7808L7.93938 16.5462C8.27855 15.9779 8.27855 15.035 7.93938 14.4667L6.59813 12.2192C2.15813 4.79207 5.79646 1.74374 14.661 5.46374Z"
        stroke="#4E4E4E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
