import { twMerge } from "tailwind-merge";

export default function SearchIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={twMerge("w-6 h-6", className)}
    >
      <path
        fill="currentColor"
        d="M16.79 15.74l4.58 4.57a1 1 0 0 1-1.42 1.10l-5.57-5.58a7 7 0 1 1 1.42-1.41zM15 10a5 5 0 1 0-5 5 5 5 0 0 0 5-5z"
      />
    </svg>
  );
}
