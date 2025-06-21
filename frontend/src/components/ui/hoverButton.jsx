import React from "react";
import { Link } from "react-router-dom";

const hoverButton = () => {
  return (
    <div className="flex justify-center mb-8">
      <Link
        to={"/chat"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        <span className="relative inline-block overflow-hidden rounded-full p-[1px]">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]"></span>
          <div className="inline-flex h-full w-full cursor-pointer justify-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
            New ManimAI v1.0 ⚡️
            <span className="inline-flex items-center pl-2 text-black dark:text-white">
              Try now{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pl-0.5 text-black dark:text-white"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </span>
      </Link>
    </div>
  );
};

export default hoverButton;
