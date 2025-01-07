"use client";

import { useRouter } from "next/navigation";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

export default function LoginModal() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessage("");
  };

  const onClickClose = () => {
    router.back();
  };

  const onChangeId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setId(e.target.value);
  };

  const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center fixed bg-black bg-opacity-40 dark:bg-opacity-50 top-0 left-0">
      <div className="relative w-full max-w-4xl min-w-[600px] bg-white dark:bg-gray-800 rounded-lg flex flex-col h-[450px]">
        <div className="p-9 text-2xl font-bold flex justify-between items-center">
          <button
            className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center hover:bg-opacity-10"
            onClick={onClickClose}
          >
            <svg
              width={24}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="text-black dark:text-white"
            >
              <g>
                <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
              </g>
            </svg>
          </button>
          <div>로그인하세요.</div>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col flex-1">
          <div className="flex-1 px-20 py-5">
            <div className="flex flex-col mb-6 relative">
              <label className="absolute top-0 left-0 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
                아이디
              </label>
              <input
                id="id"
                className="w-full p-3 pt-6 border-none outline-none rounded-md text-base"
                value={id}
                onChange={onChangeId}
                type="text"
                placeholder="아이디"
              />
            </div>
            <div className="flex flex-col mb-6 relative">
              <label className="absolute top-0 left-0 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
                비밀번호
              </label>
              <input
                id="password"
                className="w-full p-3 pt-6 border-none outline-none rounded-md text-base"
                value={password}
                onChange={onChangePassword}
                type="password"
                placeholder="비밀번호"
              />
            </div>
          </div>
          <div className="text-red-600 font-bold text-center py-2">
            {message}
          </div>
          <div className="px-20 py-6">
            <button
              type="submit"
              className="w-full h-12 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:opacity-50"
              disabled={!id || !password}
            >
              로그인하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
