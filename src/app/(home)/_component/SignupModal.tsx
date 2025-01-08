"use client";

import AuthUI, { AuthViewType } from "@/components/auth/AuthUI";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function SignupModal() {
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
      <div className="relative w-full max-w-4xl min-w-[600px] bg-white dark:bg-gray-800 rounded-lg flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-transform transform hover:scale-110"
          aria-label="Close"
          onClick={onClickClose}
        >
          <FaTimes size={24} />
        </button>
        <div className="p-9 text-2xl font-bold flex justify-center items-center">
          <AuthUI viewType={AuthViewType.SIGNUP} allowOauth={true} />
        </div>
      </div>
    </div>
  );
}
